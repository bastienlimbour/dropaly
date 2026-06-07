import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { AuthSession } from "@dropaly/auth/server";

export interface Actor {
  id: string;
  email: string;
  name: string;
  role: string | null;
  sessionId: string;
}

function actorFromAuthSession(authSession: AuthSession): Actor {
  return {
    id: authSession.user.id,
    email: authSession.user.email,
    name: authSession.user.name,
    role: "role" in authSession.user ? String(authSession.user.role) : null,
    sessionId: authSession.session.id,
  };
}

const authSessionPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest("authSession", null);
  app.decorateRequest("actor", null);

  app.decorateRequest("getActor", function (this: FastifyRequest) {
    if (!this.actor) {
      throw new Error("Invariant violation: actor is missing");
    }

    return this.actor;
  });

  async function resolveAuthSession(request: FastifyRequest) {
    if (request.authSession && request.actor) {
      return request.authSession;
    }

    const authSession = await app.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!authSession) {
      request.authSession = null;
      request.actor = null;
      return null;
    }

    request.authSession = authSession;
    request.actor = actorFromAuthSession(authSession);

    return authSession;
  }

  app.decorate("optionalAuth", async (request: FastifyRequest) => {
    await resolveAuthSession(request);
  });

  app.decorate(
    "requireAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authSession = await resolveAuthSession(request);

      if (!authSession) {
        return reply.code(401).send({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }
    },
  );
};

export const authSession = fastifyPlugin(authSessionPlugin);
