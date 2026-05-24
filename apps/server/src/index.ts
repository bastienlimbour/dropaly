import { env } from "@dropaly/env/server";
import { createApp } from "./app";

const app = createApp();

try {
  await app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT });
  app.log.info(`Server running on ${env.SERVER_HOST}:${env.SERVER_PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
