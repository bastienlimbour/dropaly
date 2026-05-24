import { expo } from "@better-auth/expo";
import { createDb } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";
import { env } from "@dropaly/env/server";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { paymentsPlugin } from "./lib/payments";

const db = createDb();

const authOptions: BetterAuthOptions = {
  appName: "Dropaly",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: env.BETTER_AUTH_ALLOWED_HOSTS
    ? {
        allowedHosts: env.BETTER_AUTH_ALLOWED_HOSTS,
        fallback: env.BETTER_AUTH_URL,
        protocol: env.NODE_ENV === "development" ? "http" : "https",
      }
    : env.BETTER_AUTH_URL,
  trustedOrigins: [
    ...env.CORS_ORIGINS,
    "dropaly://",
    ...(env.NODE_ENV === "development" ? ["exp://"] : []),
  ],
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [...(env.PAYMENTS_ENABLED ? [paymentsPlugin()] : []), expo()],
};

export function createAuth() {
  return betterAuth(authOptions);
}

export const auth = createAuth();
