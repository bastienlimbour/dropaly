import { aiChatRequestBodySchema, streamAiChat } from "@dropaly/api/server";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { getAuthenticatedActor } from "../plugins/api-context";

export function registerAiRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/ai",
    {
      preHandler: app.requireAuth,
      schema: {
        body: aiChatRequestBodySchema,
      },
    },
    async function (request) {
      const actor = getAuthenticatedActor(request);

      return streamAiChat({ actor, messages: request.body.messages });
    },
  );
}
