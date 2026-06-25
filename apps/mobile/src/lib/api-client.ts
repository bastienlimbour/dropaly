import { fetch as expoFetch } from "expo/fetch";

import { createApiClient } from "@dropaly/api-client";

import { env } from "@/env";
import { authClient } from "@/lib/auth-client";

export const apiClient = createApiClient({
  baseUrl: env.EXPO_PUBLIC_API_URL,
  fetch: expoFetch as typeof fetch,
  credentials: "omit",
  getHeaders() {
    const cookies = authClient.getCookie();
    return cookies ? { Cookie: cookies } : undefined;
  },
});
