import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Platform } from "react-native";

import { env } from "@dropaly/env/native";

import { authClient } from "@/lib/auth-client";

function generateAPIUrl(relativePath: string) {
  const serverUrl = env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("EXPO_PUBLIC_SERVER_URL environment variable is not defined");
  }
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
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
    api: generateAPIUrl("/ai"),
  });
}
