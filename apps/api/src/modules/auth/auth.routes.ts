import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: ["GET", "POST"],
    url: "/auth/*",

    async handler(request, reply) {
      try {
        const url = new URL(
          request.url,
          `${request.protocol}://${request.headers.host}`,
        );
        const authRequest = new Request(url.toString(), {
          method: request.method,
          headers: fromNodeHeaders(request.headers),
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        const response = await app.auth.handler(authRequest);

        reply.status(response.status);

        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        const body = response.body ? await response.text() : null;

        return await reply.send(body);
      } catch (err) {
        request.log.error({ err }, "Authentication error");

        return reply.status(500).send({
          code: "AUTH_FAILURE",
          message: "Internal authentication error",
        });
      }
    },
  });
};
