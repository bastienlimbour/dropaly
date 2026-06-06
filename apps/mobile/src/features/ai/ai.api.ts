import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Platform } from "react-native";

import { env } from "@/env";
import { authClient } from "@/lib/auth-client";

function generateAPIUrl(relativePath: string) {
  const apiUrl = env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_API_URL environment variable is not defined");
  }
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return apiUrl.concat(path);
}

export function createAiChatTransport() {
  return new DefaultChatTransport({
    fetch(url, options) {
      const headers = new Headers(options?.headers);
      const cookies = authClient.getCookie();

      if (Platform.OS !== "web" && cookies) {
        headers.set("Cookie", cookies);
      }

      return expoFetch(url, {
        ...options,
        credentials: Platform.OS === "web" ? "include" : "omit",
        headers,
      }) as ReturnType<typeof globalThis.fetch>;
    },
    api: generateAPIUrl("/api/ai/chat"),
  });
}
