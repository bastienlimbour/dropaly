import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import { createAuthenticatedUserFromAuthSession } from "@/modules/auth/authenticated-user";

const authContextPluginFn: FastifyPluginAsync = async (app) => {
  app.decorateRequest("authenticatedUser", null);

  app.addHook("onRequest", async (request) => {
    const authSession = await app.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!authSession) {
      request.authenticatedUser = null;
      return;
    }

    request.authenticatedUser = createAuthenticatedUserFromAuthSession(authSession);
  });
};

export const authContextPlugin = fastifyPlugin(authContextPluginFn, {
  name: "auth-context",
  dependencies: ["app-dependencies"],
});
