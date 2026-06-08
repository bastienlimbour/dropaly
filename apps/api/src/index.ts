import { createAuth } from "@dropaly/auth/server";
import { createDb } from "@dropaly/db";

import { createApp } from "./app";
import { env } from "./env";

const loggerOptions = {
  // development: true,
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
  test: true,
} as const;

const { db, dbPool } = createDb({ databaseUrl: env.DATABASE_URL });

const auth = createAuth({
  db,
  nodeEnv: env.NODE_ENV,
  allowedServerHosts: env.BETTER_AUTH_ALLOWED_HOSTS,
  fallbackServerUrl: env.BETTER_AUTH_URL,
  corsOrigins: env.CORS_ORIGINS,
  secret: env.BETTER_AUTH_SECRET,
  paymentEnabled: env.PAYMENT_ENABLED,
  paymentAccessToken: env.POLAR_ACCESS_TOKEN,
  paymentSuccessUrl: env.POLAR_SUCCESS_URL,
});

const app = createApp({
  db,
  auth,
  logger: loggerOptions[env.NODE_ENV],
  corsOrigins: env.CORS_ORIGINS,
  nodeEnv: env.NODE_ENV,
});

app.addHook("onClose", async () => {
  await dbPool.end();
});

try {
  await app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT });
  app.log.info(`Server running on ${env.SERVER_HOST}:${env.SERVER_PORT}`);
} catch (err) {
  app.log.error(err);
  await app.close();
  process.exit(1);
}
