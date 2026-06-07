import { convertToModelMessages, streamText, validateUIMessages } from "ai";
import type { UIMessage } from "ai";

import { requireEntitlement as defaultRequireEntitlement } from "@/modules/billing/billing.index";
import type { Actor } from "@/plugins/auth-session";
import { createAiModel as defaultCreateAiModel } from "./adapters/google";

interface AiServiceDeps {
  createAiModel?: typeof defaultCreateAiModel;
  requireEntitlement?: typeof defaultRequireEntitlement;
}

export function makeAiService(deps: AiServiceDeps = {}) {
  const createAiModel = deps.createAiModel ?? defaultCreateAiModel;
  const requireEntitlement = deps.requireEntitlement ?? defaultRequireEntitlement;

  return {
    async streamChat({ actor, messages }: { actor: Actor; messages: UIMessage[] }) {
      await requireEntitlement(actor, "ai.chat");
      const validatedMessages = await validateUIMessages({
        messages,
      });

      const result = streamText({
        model: await createAiModel(),
        messages: await convertToModelMessages(validatedMessages),
      });

      return result.toUIMessageStreamResponse();
    },
  };
}
