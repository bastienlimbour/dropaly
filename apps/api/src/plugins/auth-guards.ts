import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import { AppError } from "@/errors/app-error";

const authGuardsPluginFn: FastifyPluginAsync = async (app) => {
  app.decorateRequest("requireActor", function (this: FastifyRequest) {
    if (!this.actor) {
      throw new Error("Invariant violation: actor is missing");
    }

    return this.actor;
  });

  app.decorate("requireAuth", async (request: FastifyRequest) => {
    if (!request.actor) {
      throw new AppError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }
  });

  app.decorate("requireRole", (requiredRole: string) => {
    return async function requireRolePreValidation(
      request: FastifyRequest,
      reply: FastifyReply,
    ) {
      await app.requireAuth(request, reply);

      if (reply.sent) {
        return;
      }

      const actor = request.requireActor();

      if (actor.role !== requiredRole) {
        throw new AppError({
          statusCode: 403,
          code: "FORBIDDEN",
          message: "Missing required role",
        });
      }
    };
  });
};

export const authGuardsPlugin = fastifyPlugin(authGuardsPluginFn, {
  name: "auth-guards",
  dependencies: ["auth-context"],
});
