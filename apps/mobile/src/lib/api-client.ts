import { fetch as expoFetch } from "expo/fetch";
import { Platform } from "react-native";

import { createApiClient, createApiRuntime } from "@dropaly/api-client";

import { env } from "@/env";
import { authClient } from "@/lib/auth-client";

export const apiRuntime = createApiRuntime({
  baseUrl: env.EXPO_PUBLIC_API_URL,
  fetch: expoFetch,
  credentials: Platform.OS === "web" ? "include" : "omit",
  getHeaders() {
    if (Platform.OS === "web") return undefined;

    const cookies = authClient.getCookie();
    return cookies ? { Cookie: cookies } : undefined;
  },
});

export const apiClient = createApiClient({ runtime: apiRuntime });
