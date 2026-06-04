import type { FastifyInstance } from "fastify";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get("/", {
    handler() {
      return "OK";
    },
  });

  app.get("/health", {
    handler() {
      return "OK";
    },
  });
}
