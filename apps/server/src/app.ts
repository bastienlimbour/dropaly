import Fastify from "fastify";
import type { FastifyServerOptions } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";
import type { ServerEnv } from "@dropaly/env/server";

import { registerApiContext } from "./plugins/api-context";
import { registerCors } from "./plugins/cors";
import { registerAiRoutes } from "./routes/ai";
import { registerAuthRoutes } from "./routes/auth";
import { registerHealthRoutes } from "./routes/health";
import { registerTRPCRoutes } from "./routes/trpc";

interface CreateAppOptions {
  auth: Auth;
  corsOrigins: ServerEnv["CORS_ORIGINS"];
  db: Db;
  logger?: FastifyServerOptions["logger"];
}

export function createApp(options: CreateAppOptions) {
  const app = Fastify({
    logger: options.logger ?? true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Plugins
  registerCors(app, { corsOrigins: options.corsOrigins });

  // Routes
  registerAuthRoutes(app, { auth: options.auth });
  registerHealthRoutes(app);

  app.register((apiApp) => {
    const zodApiApp = apiApp.withTypeProvider<ZodTypeProvider>();

    registerApiContext(zodApiApp, { auth: options.auth, db: options.db });
    registerTRPCRoutes(zodApiApp);
    registerAiRoutes(zodApiApp);
  });

  return app;
}

export type App = ReturnType<typeof createApp>;
