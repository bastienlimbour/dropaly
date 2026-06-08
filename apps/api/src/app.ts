import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyServerOptions } from "fastify";
import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import type { ServerEnv } from "./env";
import { aiRoutes } from "./modules/ai/ai.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { healthRoutes } from "./modules/health/health.routes";
import { privateDataRoutes } from "./modules/private-data/private-data.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { appDependenciesPlugin } from "./plugins/app-dependencies";
import { authContextPlugin } from "./plugins/auth-context";
import { authGuardsPlugin } from "./plugins/auth-guards";
import { corsPlugin } from "./plugins/cors";

interface CreateAppOptions {
  auth: Auth;
  corsOrigins: ServerEnv["CORS_ORIGINS"];
  db: Db;
  logger?: FastifyServerOptions["logger"];
  nodeEnv: ServerEnv["NODE_ENV"];
}

export function createApp(options: CreateAppOptions) {
  const app = Fastify({
    logger: options.logger ?? true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(corsPlugin, { corsOrigins: options.corsOrigins });

  app.register(swagger, {
    openapi: {
      info: {
        title: "Dropaly API",
        version: "0.1.0",
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  if (options.nodeEnv !== "production") {
    app.register(swaggerUi, { routePrefix: "/docs" });
  }

  app.register(appDependenciesPlugin, { db: options.db, auth: options.auth });
  app.register(authContextPlugin);
  app.register(authGuardsPlugin);

  // Routes / Services
  app.register(
    (api) => {
      api.register(authRoutes);
      api.register(aiRoutes);
      api.register(todoRoutes);
      api.register(privateDataRoutes);
      api.register(healthRoutes);
    },
    { prefix: "/api" },
  );

  return app;
}

export type App = ReturnType<typeof createApp>;
