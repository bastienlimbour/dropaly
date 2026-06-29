import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { errorResponseSchema } from "@/schemas/error.schema";
import { privateDataSchema } from "./private-data.schema";

export const privateDataRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/private-data",
    schema: {
      tags: ["private-data"],
      operationId: "getPrivateData",
      response: { 200: privateDataSchema, 401: errorResponseSchema },
    },
    preValidation: app.requireAuthenticatedUser,
    async handler(request, reply) {
      const user = request.getAuthenticatedUser();
      return reply.status(200).send({
        message: "This is private",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    },
  });
};
