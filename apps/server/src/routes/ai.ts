import { aiChatRequestBodySchema, aiService } from "@dropaly/api/server";

import type { App } from "@/app";
import { getAuthenticatedContext } from "@/plugins/api-context";

export function registerAiRoutes(app: App) {
  app.post("/ai", {
    preHandler: app.requireAuth,
    schema: { body: aiChatRequestBodySchema },
    async handler(request) {
      const ctx = getAuthenticatedContext(request);
      return aiService(ctx).streamChat({ messages: request.body.messages });
    },
  });
}
