import { createApiClient } from "@dropaly/api-client";
import { env } from "@dropaly/env/web";

export const api = createApiClient({
  baseUrl: env.VITE_SERVER_URL,
  credentials: "include",
});
