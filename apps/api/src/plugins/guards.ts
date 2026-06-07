import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const guardsPlugin: FastifyPluginAsync = async (app) => {
  app.decorate("requireRole", (role: string) => {
    return async function requireRole(request: FastifyRequest, reply: FastifyReply) {
      await app.requireAuth(request, reply);

      if (reply.sent) {
        return;
      }

      const actor = request.getActor();

      if (actor.role !== role) {
        return reply.code(403).send({
          code: "FORBIDDEN",
          message: "Missing required role",
        });
      }
    };
  });
};

export default fp(guardsPlugin);
