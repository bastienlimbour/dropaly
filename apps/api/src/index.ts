import { createAuth } from "@dropaly/auth/server";
import { createDb } from "@dropaly/db";
import { env } from "@dropaly/env/server";

import { createApp } from "./app";

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
} as const;

const database = createDb({ databaseUrl: env.DATABASE_URL });
const auth = createAuth({
  db: database.db,
  nodeEnv: env.NODE_ENV,
  allowedServerHosts: env.BETTER_AUTH_ALLOWED_HOSTS,
  fallbackServerUrl: env.BETTER_AUTH_URL,
  corsOrigins: env.CORS_ORIGINS,
  secret: env.BETTER_AUTH_SECRET,
  paymentsEnabled: env.PAYMENTS_ENABLED,
  paymentAccessToken: env.POLAR_ACCESS_TOKEN,
  paymentSuccessUrl: env.POLAR_SUCCESS_URL,
});

const app = createApp({
  auth,
  corsOrigins: env.CORS_ORIGINS,
  db: database.db,
  logger: loggerOptions[env.NODE_ENV],
  nodeEnv: env.NODE_ENV,
});

app.addHook("onClose", async () => {
  await database.close();
});

try {
  await app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT });
  app.log.info(`Server running on ${env.SERVER_HOST}:${env.SERVER_PORT}`);
} catch (err) {
  app.log.error(err);
  await app.close();
  process.exit(1);
}
