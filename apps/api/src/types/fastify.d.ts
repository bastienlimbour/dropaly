import type { preValidationAsyncHookHandler } from "fastify";

import type { Auth } from "@dropaly/auth";
import type { Db } from "@dropaly/db";

import type { AuthenticatedUser } from "@/modules/auth/authenticated-user";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
    auth: Auth;

    requireAuthenticatedUser: preValidationAsyncHookHandler;
    requireRole: (requiredRole: string) => preValidationAsyncHookHandler;
  }

  interface FastifyRequest {
    authenticatedUser: AuthenticatedUser | null;
    getAuthenticatedUser(): AuthenticatedUser;
  }
}
