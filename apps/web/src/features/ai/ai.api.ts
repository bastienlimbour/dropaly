import { DefaultChatTransport } from "ai";

import { env } from "@/env";

export function createAiChatTransport() {
  return new DefaultChatTransport({
    api: `${env.VITE_API_URL}/api/ai/chat`,
    fetch(url, options) {
      return globalThis.fetch(url, { ...options, credentials: "include" });
    },
  });
}
