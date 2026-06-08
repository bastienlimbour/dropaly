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
import { authSession } from "./plugins/auth-session";
import { cors } from "./plugins/cors";
import { dependencies } from "./plugins/dependencies";

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

  app.register(cors, { corsOrigins: options.corsOrigins });

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

  app.register(dependencies, { db: options.db, auth: options.auth });
  app.register(authSession);
  // app.register(guardsPlugin)

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
