import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { getAuthenticatedContext } from "@/fastify-context";
import { errorResponseSchema } from "@/schemas/error.schemas";
import { aiChatRequestBodySchema } from "./ai.schemas";
import { aiService } from "./ai.service";

export function registerAiRoutes(app: FastifyInstance) {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.post("/ai/chat", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["ai"],
      body: aiChatRequestBodySchema,
      response: {
        200: z.any().describe("AI SDK UI message stream"),
        401: errorResponseSchema,
      },
    },
    handler(request) {
      const ctx = getAuthenticatedContext(request);
      return aiService(ctx).streamChat({ messages: request.body.messages });
    },
  });
}
