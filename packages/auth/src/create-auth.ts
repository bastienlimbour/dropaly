import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import type { BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";

import { paymentsPlugin } from "./lib/payments";

interface CreateAuthOptions {
  db: Db;
  nodeEnv: "development" | "production" | "test";
  allowedServerHosts?: string[] | undefined;
  fallbackServerUrl: string;
  corsOrigins: string[];
  secret: string;
  paymentsEnabled: boolean;
  paymentAccessToken?: string | undefined;
  paymentSuccessUrl?: string | undefined;
}

export function createAuth(options: CreateAuthOptions) {
  const plugins: BetterAuthPlugin[] = [expo()];

  if (options.paymentsEnabled) {
    if (!options.paymentAccessToken) {
      throw new Error(
        "POLAR_ACCESS_TOKEN is required when payments are enabled (PAYMENTS_ENABLED environment variable)",
      );
    }

    if (!options.paymentSuccessUrl) {
      throw new Error(
        "POLAR_SUCCESS_URL is required when payments are enabled (PAYMENTS_ENABLED environment variable)",
      );
    }

    plugins.push(
      paymentsPlugin({
        accessToken: options.paymentAccessToken,
        successUrl: options.paymentSuccessUrl,
      }),
    );
  }

  return betterAuth({
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
    plugins,
  });
}

export type Auth = ReturnType<typeof createAuth>;
