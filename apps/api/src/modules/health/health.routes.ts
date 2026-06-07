import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", {
    handler() {
      return { status: "OK" };
    },
  });

  app.get("/health", {
    handler() {
      return { status: "OK" };
    },
  });
};
