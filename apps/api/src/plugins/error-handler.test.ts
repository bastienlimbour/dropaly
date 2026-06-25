import { APIError } from "better-auth/api";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { DatabaseError } from "pg";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import { createApp } from "@/app";
import type { App } from "@/app";

let testApp: App | undefined;

type TestAuthGetSession = (
  ...args: Parameters<Auth["api"]["getSession"]>
) => ReturnType<Auth["api"]["getSession"]>;

function createTestApp(
  options: {
    authGetSession?: TestAuthGetSession;
    authHandler?: Auth["handler"];
  } = {},
) {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const auth = {
    api: {
      getSession: options.authGetSession ?? vi.fn().mockResolvedValue(null),
    },
    handler: options.authHandler ?? vi.fn(),
  } as unknown as Auth;

  testApp = createApp({
    auth,
    corsOrigins: [],
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    db: {} as Db,
    logger: false,
    nodeEnv: "test",
  });

  return testApp;
}

afterEach(async () => {
  await testApp?.close();
  testApp = undefined;
});

describe("error handler", () => {
  it("returns the health check response as JSON", async () => {
    const server = createTestApp();

    const response = await server.inject({ method: "GET", url: "/api/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "OK" });
  });

  it("standardizes not found responses", async () => {
    const server = createTestApp();

    const response = await server.inject({ method: "GET", url: "/api/missing" });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: "NOT_FOUND",
      error: "Not Found",
      message: "Route not found.",
    });
  });

  it("standardizes request validation errors", async () => {
    const server = createTestApp();

    const response = await server.inject({
      method: "POST",
      url: "/api/health",
      payload: { payload: 123 },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body).toMatchObject({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      error: "Bad Request",
      message: "Invalid request.",
    });
    expect(body.validation.length).toBeGreaterThan(0);
    expect(body.validation[0]).toMatchObject({
      instancePath: expect.any(String),
    });
  });

  it("does not expose runtime error messages for server errors", async () => {
    const server = createTestApp();

    server.get("/api/boom", async () => {
      throw new Error("Ca marche pas");
    });

    const response = await server.inject({ method: "GET", url: "/api/boom" });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      error: "Internal Server Error",
      message: "Internal server error.",
    });
  });

  it("does not expose response serialization details", async () => {
    const server = createTestApp();

    server.get(
      "/api/bad-response",
      {
        schema: {
          response: {
            200: z.object({ ok: z.string() }),
          },
        },
      },
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      async () => ({ ok: 123 }) as unknown as { ok: string },
    );

    const response = await server.inject({
      method: "GET",
      url: "/api/bad-response",
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      error: "Internal Server Error",
      message: "Internal server error.",
    });
  });

  it("maps known database errors without exposing SQL details", async () => {
    const server = createTestApp();

    const pgError = new DatabaseError("duplicate key", 42, "error");
    pgError.code = "23505";

    server.get("/api/db-error", async () => {
      throw new DrizzleQueryError("insert into todo", [], pgError);
    });

    const response = await server.inject({ method: "GET", url: "/api/db-error" });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      statusCode: 409,
      code: "UNIQUE_VIOLATION",
      error: "Conflict",
      message: "Resource already exists.",
    });
  });

  it("maps postgres shutdown errors to service unavailable", async () => {
    const server = createTestApp();

    const pgError = new DatabaseError(
      "terminating connection due to administrator command",
      116,
      "error",
    );
    pgError.code = "57P01";

    server.get("/api/db-shutdown", async () => {
      throw new DrizzleQueryError("select 1", [], pgError);
    });

    const response = await server.inject({
      method: "GET",
      url: "/api/db-shutdown",
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      statusCode: 503,
      code: "DATABASE_UNAVAILABLE",
      error: "Service Unavailable",
      message: "Database is temporarily unavailable.",
    });
  });

  it("maps auth database connection errors to service unavailable", async () => {
    const connectionError = Object.assign(
      new AggregateError([], "connect ECONNREFUSED"),
      { code: "ECONNREFUSED" },
    );

    const server = createTestApp({
      authHandler: vi.fn(async () => {
        throw new DrizzleQueryError("select * from user", [], connectionError);
      }),
    });

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/sign-in/email",
      payload: { email: "localhost@localhost.dev", password: "password" },
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      statusCode: 503,
      code: "DATABASE_UNAVAILABLE",
      error: "Service Unavailable",
      message: "Database is temporarily unavailable.",
    });
  });

  it("preserves auth API error codes", async () => {
    const server = createTestApp({
      authHandler: vi.fn(async () => {
        throw new APIError("UNAUTHORIZED", {
          code: "INVALID_EMAIL_OR_PASSWORD",
          message: "Invalid email or password",
        });
      }),
    });

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/sign-in/email",
      payload: { email: "localhost@localhost.dev", password: "password" },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({
      statusCode: 401,
      code: "INVALID_EMAIL_OR_PASSWORD",
      error: "Unauthorized",
      message: "Invalid email or password",
    });
  });

  it("maps auth session lookup failures to service unavailable", async () => {
    const server = createTestApp({
      authGetSession: vi.fn(async () => {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          code: "FAILED_TO_GET_SESSION",
          message: "Failed to get session",
        });
      }),
    });

    const response = await server.inject({ method: "GET", url: "/api/todos" });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      statusCode: 503,
      code: "DATABASE_UNAVAILABLE",
      error: "Service Unavailable",
      message: "Database is temporarily unavailable.",
    });
  });

  it("standardizes auth guard errors", async () => {
    const server = createTestApp();

    const response = await server.inject({ method: "GET", url: "/api/todos" });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({
      statusCode: 401,
      code: "UNAUTHORIZED",
      error: "Unauthorized",
      message: "Authentication required",
    });
  });
});
