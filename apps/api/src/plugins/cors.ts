import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import type { ServerEnv } from "@/env";

export function registerCors(
  app: FastifyInstance,
  options: { corsOrigins: ServerEnv["CORS_ORIGINS"] },
) {
  app.register(fastifyCors, {
    origin: options.corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
}
