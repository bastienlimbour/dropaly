import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import type { AuthSession } from "@dropaly/auth/server";

export interface Actor {
  id: string;
  email: string;
  name: string;
  role: string | null;
  sessionId: string;
}

function createActorFromAuthSession(authSession: AuthSession): Actor {
  return {
    id: authSession.user.id,
    email: authSession.user.email,
    name: authSession.user.name,
    role: "role" in authSession.user ? String(authSession.user.role) : null,
    sessionId: authSession.session.id,
  };
}

const authContextPluginFn: FastifyPluginAsync = async (app) => {
  app.decorateRequest("actor", null);

  app.addHook("onRequest", async (request) => {
    const authSession = await app.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!authSession) {
      request.actor = null;
      return;
    }

    request.actor = createActorFromAuthSession(authSession);
  });
};

export const authContextPlugin = fastifyPlugin(authContextPluginFn, {
  name: "auth-context",
  dependencies: ["app-dependencies"],
});
