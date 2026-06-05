import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";
import type { ServerEnv } from "@dropaly/env/server";

import { paymentsPlugin } from "./lib/payments";

interface CreateAuthOptions {
  db: Db;
  nodeEnv: ServerEnv["NODE_ENV"];
  allowedServerHosts: ServerEnv["BETTER_AUTH_ALLOWED_HOSTS"];
  fallbackServerUrl: ServerEnv["BETTER_AUTH_URL"];
  corsOrigins: ServerEnv["CORS_ORIGINS"];
  secret: ServerEnv["BETTER_AUTH_SECRET"];
  paymentsEnabled: ServerEnv["PAYMENTS_ENABLED"];
  paymentAccessToken: ServerEnv["POLAR_ACCESS_TOKEN"];
  paymentSuccessUrl: ServerEnv["POLAR_SUCCESS_URL"];
}

export function createAuth(options: CreateAuthOptions) {
  const authOptions: BetterAuthOptions = {
    appName: "Dropaly",
    database: drizzleAdapter(options.db, { provider: "pg", schema }),
    advanced: { database: { generateId: "uuid" } },
    baseURL: options.allowedServerHosts
      ? {
          allowedHosts: options.allowedServerHosts,
          fallback: options.fallbackServerUrl,
          protocol: options.nodeEnv === "development" ? "http" : "https",
        }
      : options.fallbackServerUrl,
    trustedOrigins: [
      "dropaly://",
      ...options.corsOrigins,
      ...(options.nodeEnv === "development" ? ["exp://"] : []),
    ],
    secret: options.secret,
    emailAndPassword: { enabled: true },
    plugins: [
      ...(options.paymentsEnabled
        ? [
            paymentsPlugin({
              accessToken: options.paymentAccessToken,
              successUrl: options.paymentSuccessUrl,
            }),
          ]
        : []),
      expo(),
    ],
  };

  return betterAuth(authOptions);
}

export type Auth = ReturnType<typeof createAuth>;
