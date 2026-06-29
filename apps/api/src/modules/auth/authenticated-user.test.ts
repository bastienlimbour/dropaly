import { describe, expect, it } from "vitest";

import type { AuthSession } from "@dropaly/auth/server";

import { AppError } from "@/errors/app-error";
import {
  createAuthenticatedUserFromAuthSession,
  getAuthenticatedUser,
  requireAuthenticatedUser,
  requireRole,
} from "./authenticated-user";
import type { AuthenticatedUser } from "./authenticated-user";

const user = {
  id: "user_1",
  email: "user@example.com",
  name: "User",
  role: "admin",
  sessionId: "session_1",
} satisfies AuthenticatedUser;

describe("authenticated user", () => {
  it("creates an authenticated user from an auth session", () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const authSession = {
      user: {
        id: "user_1",
        email: "user@example.com",
        name: "User",
        role: "admin",
      },
      session: { id: "session_1" },
    } as unknown as AuthSession;

    expect(createAuthenticatedUserFromAuthSession(authSession)).toEqual(user);
  });

  it("requires an authenticated user", () => {
    expect(requireAuthenticatedUser(user)).toBe(user);

    expect(() => requireAuthenticatedUser(null)).toThrowError(AppError);
    expect(() => requireAuthenticatedUser(null)).toThrowError(
      "Authentication required",
    );
  });

  it("gets an authenticated user after the Fastify adapter has required one", () => {
    expect(getAuthenticatedUser(user)).toBe(user);
    expect(() => getAuthenticatedUser(null)).toThrowError(
      "Invariant violation: authenticated user is missing",
    );
  });

  it("requires a role", () => {
    expect(() => requireRole(user, "admin")).not.toThrow();

    expect(() => requireRole(user, "owner")).toThrowError(AppError);
    expect(() => requireRole(user, "owner")).toThrowError("Missing required role");
  });
});
