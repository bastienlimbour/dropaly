import { fromNodeHeaders } from "better-auth/node";
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import {
  createRequestContext,
  requireActor,
} from "./context";
import type { AuthenticatedContext, RequestContext } from "./context";

interface RegisterApiContextOptions {
  auth: Auth;
  db: Db;
}

declare module "fastify" {
  interface FastifyRequest {
    apiContext: RequestContext | null;
  }

  interface FastifyInstance {
    requireAuth: preHandlerHookHandler;
  }
}

function getApiContext(request: FastifyRequest): RequestContext {
  if (!request.apiContext) {
    throw new Error("API context was not initialized");
  }

  return request.apiContext;
}

export function getAuthenticatedContext(
  request: FastifyRequest,
): AuthenticatedContext {
  const context = getApiContext(request);
  const actor = requireActor(context);

  return { ...context, actor };
}


async function createApiContext(
  request: FastifyRequest,
  options: RegisterApiContextOptions,
): Promise<RequestContext> {
  const session = await options.auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  return createRequestContext({
    db: options.db,
    session,
    requestId: request.id,
  });
}

export function registerApiContext(
  app: FastifyInstance,
  options: RegisterApiContextOptions,
) {
  app.decorateRequest("apiContext", null);

  app.addHook("onRequest", async (request) => {
    request.apiContext = await createApiContext(request, options);
  });

  app.decorate("requireAuth", async (request, reply) => {
    const context = getApiContext(request);

    if (!context.actor) {
      await reply
        .status(401)
        .send({ error: "Authentication required", code: "UNAUTHORIZED" });
    }
  });
}
