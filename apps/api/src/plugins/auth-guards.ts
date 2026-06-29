import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
  requireRole,
} from "@/modules/auth/authenticated-user";

const authGuardsPluginFn: FastifyPluginAsync = async (app) => {
  app.decorateRequest("getAuthenticatedUser", function (this: FastifyRequest) {
    return getAuthenticatedUser(this.authenticatedUser);
  });

  app.decorate("requireAuthenticatedUser", async (request: FastifyRequest) => {
    requireAuthenticatedUser(request.authenticatedUser);
  });

  app.decorate("requireRole", (requiredRole: string) => {
    return async function requireRolePreValidation(
      request: FastifyRequest,
      reply: FastifyReply,
    ) {
      await app.requireAuthenticatedUser(request, reply);

      if (reply.sent) {
        return;
      }

      requireRole(request.getAuthenticatedUser(), requiredRole);
    };
  });
};

export const authGuardsPlugin = fastifyPlugin(authGuardsPluginFn, {
  name: "auth-guards",
  dependencies: ["auth-context"],
});
