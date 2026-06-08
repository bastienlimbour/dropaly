import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";

import { paymentPlugin } from "./plugins/payment";

interface CreateAuthOptions {
  db: Db;
  nodeEnv: "development" | "production" | "test";
  allowedServerHosts?: string[] | undefined;
  fallbackServerUrl: string;
  corsOrigins: string[];
  secret: string;
  paymentEnabled: boolean;
  paymentAccessToken?: string | undefined;
  paymentSuccessUrl?: string | undefined;
}

export function createAuth(options: CreateAuthOptions) {
  if (options.paymentEnabled && !options.paymentAccessToken) {
    throw new Error(
      "POLAR_ACCESS_TOKEN is required when payments are enabled (PAYMENT_ENABLED environment variable)",
    );
  }

  if (options.paymentEnabled && !options.paymentSuccessUrl) {
    throw new Error(
      "POLAR_SUCCESS_URL is required when payments are enabled (PAYMENT_ENABLED environment variable)",
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
    plugins: [
      expo(),
      ...(options.paymentEnabled &&
      options.paymentAccessToken &&
      options.paymentSuccessUrl
        ? [
            paymentPlugin({
              accessToken: options.paymentAccessToken,
              successUrl: options.paymentSuccessUrl,
            }),
          ]
        : []),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type AuthSession = NonNullable<
  Awaited<ReturnType<Auth["api"]["getSession"]>>
>;
export type AuthUser = AuthSession["user"];
export type AuthSessionData = AuthSession["session"];
