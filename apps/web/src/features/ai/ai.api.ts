import { DefaultChatTransport } from "ai";

import { apiRuntime } from "@/lib/api-client";

export function createAiChatTransport() {
  return new DefaultChatTransport({
    api: apiRuntime.url("/api/ai/chat"),
    fetch: apiRuntime.fetch,
  });
}
