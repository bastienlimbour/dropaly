import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import type { FastifyServerOptions } from "fastify";
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import type { ServerEnv } from "./env";
import { registerApiContext } from "./fastify-context";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { registerHealthRoutes } from "./modules/health/health.routes";
import { registerCors } from "./plugins/cors";
import { registerApiRoutes } from "./router";

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

  // Plugins
  registerCors(app, { corsOrigins: options.corsOrigins });

  // Routes
  registerAuthRoutes(app, { auth: options.auth });
  registerHealthRoutes(app);

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

  app.register(
    (apiApp) => {
      const zodApiApp = apiApp.withTypeProvider<ZodTypeProvider>();

      registerApiContext(zodApiApp, { auth: options.auth, db: options.db });
      registerApiRoutes(zodApiApp);
    },
    { prefix: "/api" },
  );

  return app;
}

export type App = ReturnType<typeof createApp>;
