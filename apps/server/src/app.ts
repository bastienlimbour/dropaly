import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { env } from "@dropaly/env/server";

import { registerApiContext } from "./plugins/api-context";
import { registerCors } from "./plugins/cors";
import { registerAiRoutes } from "./routes/ai";
import { registerAuthRoutes } from "./routes/auth";
import { registerHealthRoutes } from "./routes/health";
import { registerTRPCRoutes } from "./routes/trpc";

const loggerOptions = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

export function createApp() {
  const app = Fastify({ logger: loggerOptions[env.NODE_ENV] ?? true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Plugins
  registerCors(app);

  // Routes
  registerAuthRoutes(app);
  registerHealthRoutes(app);

  app.register((apiApp) => {
    registerApiContext(apiApp);
    registerTRPCRoutes(apiApp);
    registerAiRoutes(apiApp);
  });

  return app;
}
