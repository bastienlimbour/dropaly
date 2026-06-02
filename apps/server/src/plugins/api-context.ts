import { fromNodeHeaders } from "better-auth/node";
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";

import type { Actor, RequestContext } from "@dropaly/api/server";
import { auth } from "@dropaly/auth/server";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

declare module "fastify" {
  interface FastifyRequest {
    apiContext: RequestContext | null;
  }

  interface FastifyInstance {
    requireAuth: preHandlerHookHandler;
  }
}

function createActorFromSession(session: NonNullable<Session>): Actor {
  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

async function createApiContext(request: FastifyRequest): Promise<RequestContext> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  return { actor: session ? createActorFromSession(session) : null };
}

export function registerApiContext(app: FastifyInstance) {
  app.decorateRequest("apiContext", null);

  app.addHook("onRequest", async (request) => {
    request.apiContext = await createApiContext(request);
  });

  app.decorate("requireAuth", async (request, reply) => {
    const context = getApiContext(request);

    if (!context.actor) {
      return reply
        .status(401)
        .send({ error: "Authentication required", code: "UNAUTHORIZED" });
    }

    return context.actor;
  });
}

export function getApiContext(request: FastifyRequest): RequestContext {
  if (!request.apiContext) {
    throw new Error("API context was not initialized");
  }

  return request.apiContext;
}

export function getAuthenticatedActor(request: FastifyRequest): Actor {
  const context = getApiContext(request);

  if (!context.actor) {
    throw new Error("Authenticated actor was not initialized");
  }

  return context.actor;
}
