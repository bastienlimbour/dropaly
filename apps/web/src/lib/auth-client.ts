import { env } from "@dropzen/env/web";
import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [...(env.VITE_PAYMENTS_ENABLED ? [polarClient()] : [])],
});
