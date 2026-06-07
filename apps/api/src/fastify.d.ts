import type { preHandlerAsyncHookHandler } from "fastify";

import type { Auth, AuthSession } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import type { Actor } from "./plugins/auth-session";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
    auth: Auth;

    optionalAuth: preHandlerAsyncHookHandler;
    requireAuth: preHandlerAsyncHookHandler;
    requireRole: (role: string) => preHandlerAsyncHookHandler;
  }

  interface FastifyRequest {
    authSession: AuthSession | null;
    actor: Actor | null;
    getActor(): Actor;
  }

  interface FastifyContextConfig {
    auth?: false | { role?: string };
  }
}
