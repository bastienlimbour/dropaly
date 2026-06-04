import type { FastifyInstance } from "fastify";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get("/", () => {
    return "OK";
  });

  app.get("/health", () => {
    return "OK";
  });
}
