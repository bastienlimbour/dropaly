import { createApiClient } from "@dropaly/api-client";

import { env } from "@/env";

export const apiClient = createApiClient({
  baseUrl: env.VITE_API_URL,
  credentials: "include",
});
