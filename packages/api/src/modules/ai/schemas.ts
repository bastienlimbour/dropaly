import type { UIMessage } from "ai";
import { z } from "zod";

const uiMessageSchema = z.custom<UIMessage>((value) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<UIMessage>;

  return (
    typeof message.id === "string" &&
    (message.role === "system" ||
      message.role === "user" ||
      message.role === "assistant") &&
    Array.isArray(message.parts)
  );
});

export const aiChatRequestBodySchema = z.object({
  id: z.string().optional(),
  messages: z.array(uiMessageSchema).min(1),
});

export type AiChatRequestBody = z.infer<typeof aiChatRequestBodySchema>;
