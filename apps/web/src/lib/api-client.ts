import { createApiClient, createApiRuntime } from "@dropaly/api-client";

import { env } from "@/env";

export const apiRuntime = createApiRuntime({
  baseUrl: env.VITE_API_URL,
  credentials: "include",
});

export const apiClient = createApiClient({ runtime: apiRuntime });
