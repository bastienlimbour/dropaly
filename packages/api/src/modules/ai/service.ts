import { convertToModelMessages, streamText, validateUIMessages } from "ai";
import type { UIMessage } from "ai";

import type { AuthenticatedContext } from "../../context";
import { requireEntitlement as defaultRequireEntitlement } from "../billing";
import { createAiModel as defaultCreateAiModel } from "./adapters/google";

interface AiServiceDeps {
  createAiModel?: typeof defaultCreateAiModel;
  requireEntitlement?: typeof defaultRequireEntitlement;
}

export function aiService(ctx: AuthenticatedContext, deps: AiServiceDeps = {}) {
  const createAiModel = deps.createAiModel ?? defaultCreateAiModel;
  const requireEntitlement = deps.requireEntitlement ?? defaultRequireEntitlement;

  return {
    async streamChat(input: { messages: UIMessage[] }) {
      await requireEntitlement(ctx.actor, "ai.chat");
      const validatedMessages = await validateUIMessages({
        messages: input.messages,
      });

      const result = streamText({
        model: await createAiModel(),
        messages: await convertToModelMessages(validatedMessages),
      });

      return result.toUIMessageStreamResponse();
    },
  };
}
