import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  type UIMessage,
} from "ai";

import type { Actor } from "../../context";
import { requireEntitlement } from "../billing";
import { createAiModel } from "./adapters/google";

export async function streamAiChat({
  actor,
  messages,
}: {
  actor: Actor;
  messages: UIMessage[];
}) {
  await requireEntitlement(actor, "ai.chat");
  const validatedMessages = await validateUIMessages({ messages });

  const result = streamText({
    model: await createAiModel(),
    messages: await convertToModelMessages(validatedMessages),
  });

  return result.toUIMessageStreamResponse();
}
