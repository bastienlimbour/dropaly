import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/",
    schema: {
      response: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
    async handler(_request, reply) {
      return reply.status(200).send({ status: "OK" });
    },
  });

  app.route({
    method: "GET",
    url: "/health",
    schema: {
      response: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
    async handler(_request, reply) {
      return reply.status(200).send({ status: "OK" });
    },
  });

  app.route({
    method: "POST",
    url: "/health",
    schema: {
      body: z.object({
        stringTest: z.string(),
        numberTest: z.number(),
      }),
      response: {
        200: z.object({
          status: z.string(),
          stringTest: z.string(),
          numberTest: z.number(),
        }),
      },
    },
    async handler(request, reply) {
      return reply.status(200).send({
        status: "OK",
        stringTest: request.body.stringTest,
        numberTest: request.body.numberTest,
      });
    },
  });
};
