import type { preHandlerAsyncHookHandler } from "fastify";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import type { Actor } from "./plugins/auth-context";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
    auth: Auth;

    requireAuth: preHandlerAsyncHookHandler;
    requireRole: (role: string) => preHandlerAsyncHookHandler;
  }

  interface FastifyRequest {
    actor: Actor | null;
    requireActor: () => Actor;
  }

  interface FastifyContextConfig {
    auth?: false | { role?: string };
  }
}
