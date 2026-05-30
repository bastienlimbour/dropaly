import { DefaultChatTransport } from "ai";

import { env } from "@dropaly/env/web";

export function createAiChatTransport() {
  return new DefaultChatTransport({
    api: `${env.VITE_SERVER_URL}/ai`,
    fetch(url, options) {
      return globalThis.fetch(url, { ...options, credentials: "include" });
    },
  });
}
