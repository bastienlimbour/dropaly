import type { FastifyInstance } from "fastify";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return "OK";
  });

  app.get("/health", async () => {
    return "OK";
  });
}
