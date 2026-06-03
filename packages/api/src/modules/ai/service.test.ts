import type { LanguageModel, UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Db } from "@dropaly/db";

import type { AuthenticatedContext } from "../../context";
import { aiService } from "./service";

const aiMocks = vi.hoisted(() => ({
  convertToModelMessages: vi.fn(),
  streamText: vi.fn(),
  validateUIMessages: vi.fn(),
}));

vi.mock("ai", () => ({
  convertToModelMessages: aiMocks.convertToModelMessages,
  streamText: aiMocks.streamText,
  validateUIMessages: aiMocks.validateUIMessages,
}));

const db: Db = undefined!;
const ctx: AuthenticatedContext = {
  db,
  requestId: "test",
  actor: {
    userId: "user_1",
    email: "test@example.com",
    name: "Test",
  },
};

const messages: UIMessage[] = [
  { id: "message_1", role: "user", parts: [{ type: "text", text: "Hello" }] },
];

describe("aiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    aiMocks.validateUIMessages.mockResolvedValue(messages);
    aiMocks.convertToModelMessages.mockResolvedValue([
      { role: "user", content: "Hello" },
    ]);
    aiMocks.streamText.mockReturnValue({
      toUIMessageStreamResponse: () => new Response("ok"),
    });
  });

  it("checks entitlement and streams with the injected model", async () => {
    const model: LanguageModel = undefined!;
    const requireEntitlement = vi.fn().mockResolvedValue({
      plan: "free",
      entitlements: ["ai.chat"],
    });
    const createAiModel = vi.fn().mockResolvedValue(model);

    const response = await aiService(ctx, {
      createAiModel,
      requireEntitlement,
    }).streamChat({ messages });

    expect(requireEntitlement).toHaveBeenCalledWith(ctx.actor, "ai.chat");
    expect(createAiModel).toHaveBeenCalledOnce();
    expect(aiMocks.validateUIMessages).toHaveBeenCalledWith({ messages });
    expect(aiMocks.convertToModelMessages).toHaveBeenCalledWith(messages);
    expect(aiMocks.streamText).toHaveBeenCalledWith({
      model,
      messages: [{ role: "user", content: "Hello" }],
    });
    await expect(response.text()).resolves.toBe("ok");
  });
});
