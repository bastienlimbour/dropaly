import { expo } from "@better-auth/expo";
import { createDb } from "@dropzen/db";
import * as schema from "@dropzen/db/schema/auth";
import { env } from "@dropzen/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { paymentsPlugin } from "./lib/payments";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    appName: "Dropzen",
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
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
      "dropzen://",
      ...(env.NODE_ENV === "development"
        ? [
            "exp://",
            // "exp://**",
            // "exp://192.168.*.*:*/**"
          ]
        : []),
    ],
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [...(env.PAYMENTS_ENABLED ? [paymentsPlugin()] : []), expo()],
  });
}

export const auth = createAuth();
