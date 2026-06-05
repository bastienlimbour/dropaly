import { fromNodeHeaders } from "better-auth/node";
import type { FastifyInstance } from "fastify";

import type { Auth } from "@dropaly/auth/server";

export function registerAuthRoutes(app: FastifyInstance, options: { auth: Auth }) {
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        const url = new URL(
          request.url,
          `${request.protocol}://${request.headers.host}`,
        );
        const req = new Request(url.toString(), {
          method: request.method,
          headers: fromNodeHeaders(request.headers),
          ...(request.method !== "GET" && request.body
            ? { body: JSON.stringify(request.body) }
            : {}),
        });
        const response = await options.auth.handler(req);

        reply.status(response.status);

        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        return await reply.send(response.body ? await response.text() : null);
      } catch (err) {
        request.log.error({ err }, "Authentication error");

        return reply
          .status(500)
          .send({ error: "Internal authentication error", code: "AUTH_FAILURE" });
      }
    },
  });
}
