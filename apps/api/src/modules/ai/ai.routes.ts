import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { errorResponseSchema } from "@/schemas/error.schema";
import { aiChatRequestBodySchema } from "./ai.schema";
import { makeAiService } from "./ai.service";

export const aiRoutes: FastifyPluginAsyncZod = async (app) => {
  const aiService = makeAiService();

  app.route({
    method: "POST",
    url: "/ai/chat",
    preValidation: app.requireAuthenticatedUser,
    schema: {
      tags: ["ai"],
      body: aiChatRequestBodySchema,
      response: {
        200: z.any().describe("AI SDK UI message stream"),
        401: errorResponseSchema,
      },
    },
    handler(request) {
      const user = request.getAuthenticatedUser();
      return aiService.streamChat({ user, messages: request.body.messages });
    },
  });
};
