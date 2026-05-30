import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import { env } from "@dropaly/env/server";

export function registerCors(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: env.CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
}
