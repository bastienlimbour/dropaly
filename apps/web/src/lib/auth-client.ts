import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
  plugins: env.VITE_PAYMENT_ENABLED ? [polarClient()] : [],
});
