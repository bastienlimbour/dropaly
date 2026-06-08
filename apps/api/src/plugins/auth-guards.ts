import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

const authGuardsPluginFn: FastifyPluginAsync = async (app) => {
  app.decorateRequest("requireActor", function (this: FastifyRequest) {
    if (!this.actor) {
      throw new Error("Invariant violation: actor is missing");
    }

    return this.actor;
  });

  app.decorate(
    "requireAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.actor) {
        return reply.code(401).send({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }
    },
  );

  app.decorate("requireRole", (requiredRole: string) => {
    return async function requireRolePreHandler(
      request: FastifyRequest,
      reply: FastifyReply,
    ) {
      await app.requireAuth(request, reply);

      if (reply.sent) {
        return;
      }

      const actor = request.requireActor();

      if (actor.role !== requiredRole) {
        return reply.code(403).send({
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
