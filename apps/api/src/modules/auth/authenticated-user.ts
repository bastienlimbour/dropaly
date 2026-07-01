import type { AuthSession } from "@dropaly/auth";

import { AppError } from "@/errors/app-error";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  sessionId: string;
}

export function createAuthenticatedUserFromAuthSession(
  authSession: AuthSession,
): AuthenticatedUser {
  return {
    id: authSession.user.id,
    email: authSession.user.email,
    name: authSession.user.name,
    role: "role" in authSession.user ? String(authSession.user.role) : null,
    sessionId: authSession.session.id,
  };
}

export function requireAuthenticatedUser(
  user: AuthenticatedUser | null,
): AuthenticatedUser {
  if (!user) {
    throw new AppError({
      statusCode: 401,
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return user;
}

export function getAuthenticatedUser(
  user: AuthenticatedUser | null,
): AuthenticatedUser {
  if (!user) {
    throw new Error("Invariant violation: authenticated user is missing.");
  }

  return user;
}

export function requireRole(user: AuthenticatedUser, requiredRole: string) {
  if (user.role !== requiredRole) {
    throw new AppError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "Missing required role",
    });
  }
}
