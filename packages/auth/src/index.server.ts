import { expo } from "@better-auth/expo";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";
import type { Env } from "@dropaly/env/server";

import { paymentsPlugin } from "./lib/payments";

type CreateAuthOptions = {
  db: Db;
  nodeEnv: Env["NODE_ENV"];
  allowedServerHosts: Env["BETTER_AUTH_ALLOWED_HOSTS"];
  fallbackServerUrl: Env["BETTER_AUTH_URL"];
  corsOrigins: Env["CORS_ORIGINS"];
  secret: Env["BETTER_AUTH_SECRET"];
  paymentsEnabled: Env["PAYMENTS_ENABLED"];
  paymentAccessToken: Env["POLAR_ACCESS_TOKEN"];
  paymentSuccessUrl: Env["POLAR_SUCCESS_URL"];
};

export function createAuth(options: CreateAuthOptions) {
  const authOptions: BetterAuthOptions = {
    appName: "Dropaly",
    database: drizzleAdapter(options.db, { provider: "pg", schema }),
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
