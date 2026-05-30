import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { aiChatRequestBodySchema, streamAiChat } from "@dropaly/api/server";

import { getAuthenticatedActor } from "../plugins/api-context";

export function registerAiRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/ai",
      { preHandler: app.requireAuth, schema: { body: aiChatRequestBodySchema } },
      async function (request) {
        const actor = getAuthenticatedActor(request);

        return streamAiChat({ actor, messages: request.body.messages });
      },
    );
}
