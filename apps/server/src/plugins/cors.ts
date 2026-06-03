import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import type { Env } from "@dropaly/env/server";

export function registerCors(
  app: FastifyInstance,
  options: { corsOrigins: Env["CORS_ORIGINS"] },
) {
  app.register(fastifyCors, {
    origin: options.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
}
