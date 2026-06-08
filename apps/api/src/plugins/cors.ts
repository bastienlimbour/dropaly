import fastifyCors from "@fastify/cors";
import type { FastifyPluginAsync } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import type { ServerEnv } from "@/env";

interface CorsPluginOptions {
  corsOrigins: ServerEnv["CORS_ORIGINS"];
}

const corsPluginFn: FastifyPluginAsync<CorsPluginOptions> = async (app, options) => {
  app.register(fastifyCors, {
    origin: options.corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
};

export const corsPlugin = fastifyPlugin(corsPluginFn);
