import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/",
    handler() {
      return { status: "OK" };
    },
  });

  app.route({
    method: "GET",
    url: "/health",
    handler() {
      return { status: "OK" };
    },
  });
};
