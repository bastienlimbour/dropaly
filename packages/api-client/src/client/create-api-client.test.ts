import { describe, expect, it, vi } from "vitest";

import { createNetworkApiError } from "../errors/api-client-error";
import { createApiRuntime } from "../runtime/api-runtime";
import { createApiClient } from "./create-api-client";

describe("ApiClientError", () => {
  it("throws standardized HTTP API errors from middleware", async () => {
    const api = createApiClient({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch: vi.fn().mockResolvedValue(
        Response.json(
          {
            statusCode: 403,
            code: "FORBIDDEN",
            error: "Forbidden",
            message: "Access denied.",
          },
          { status: 403, statusText: "Forbidden" },
        ),
      ),
    });

    await expect(api.GET("/api/health")).rejects.toMatchObject({
      status: 403,
      code: "FORBIDDEN",
      message: "Access denied.",
    });
  });

  it("keeps validation details on standardized HTTP API errors", async () => {
    const api = createApiClient({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch: vi.fn().mockResolvedValue(
        Response.json(
          {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            error: "Bad Request",
            message: "Invalid request.",
            validation: [{ instancePath: "/email", message: "Invalid email" }],
          },
          { status: 400, statusText: "Bad Request" },
        ),
      ),
    });

    await expect(api.GET("/api/health")).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      body: {
        validation: [{ instancePath: "/email", message: "Invalid email" }],
      },
    });
  });

  it("throws generic HTTP API errors for non-JSON error responses", async () => {
    const api = createApiClient({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch: vi.fn().mockResolvedValue(
        new Response("Server failed", {
          status: 500,
          statusText: "Internal Server Error",
          headers: { "content-type": "text/plain" },
        }),
      ),
    });

    await expect(api.GET("/api/health")).rejects.toMatchObject({
      status: 500,
      code: undefined,
      message: "Internal Server Error",
      body: "Server failed",
    });
  });

  it("keeps native parse errors for successful invalid JSON responses", async () => {
    const api = createApiClient({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch: vi.fn().mockResolvedValue(
        new Response("OK", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      ),
    });

    await expect(api.GET("/api/health")).rejects.toBeInstanceOf(SyntaxError);
  });

  it("leaves empty success responses to openapi-fetch", async () => {
    const api = createApiClient({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch: vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    });

    await expect(
      api.DELETE("/api/todos/{id}", { params: { path: { id: "todo-id" } } }),
    ).resolves.toMatchObject({ response: expect.any(Response) });
  });

  it("accepts an explicit API runtime", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const runtime = createApiRuntime({
      baseUrl: "https://api.test",
      credentials: "include",
      fetch,
    });
    const api = createApiClient({ runtime });

    await expect(api.GET("/api/health")).resolves.toMatchObject({
      response: expect.any(Response),
    });

    const request = fetch.mock.calls[0]?.[0];
    expect(request).toBeInstanceOf(Request);
    if (!(request instanceof Request)) {
      throw new Error("Expected fetch to receive a Request.");
    }

    expect(request.credentials).toBe("include");
  });

  it("wraps network errors", async () => {
    expect(createNetworkApiError(new TypeError("fetch failed"))).toMatchObject({
      status: 0,
      code: "NETWORK_ERROR",
    });
  });

  it("wraps aborted requests", async () => {
    expect(
      createNetworkApiError(new DOMException("Aborted", "AbortError")),
    ).toMatchObject({
      status: 0,
      code: "REQUEST_ABORTED",
    });
  });
});
