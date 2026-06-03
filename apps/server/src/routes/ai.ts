import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { aiChatRequestBodySchema, aiService } from "@dropaly/api/server";

import { getAuthenticatedContext } from "@/plugins/api-context";

export function registerAiRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/ai",
      { preHandler: app.requireAuth, schema: { body: aiChatRequestBodySchema } },
      function (request) {
        const ctx = getAuthenticatedContext(request);

        return aiService(ctx).streamChat({ messages: request.body.messages });
      },
    );
}
