import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "@dropaly/db";
import * as schema from "@dropaly/db/schema";

import { paymentPlugin } from "./plugins/payment";

/** Configuration required to create the Dropaly Better Auth instance. */
export interface CreateAuthOptions {
  /** Database handle used by the Better Auth Drizzle adapter. */
  db: Db;
  /** Runtime environment used to choose development-only origins and protocol. */
  nodeEnv: "development" | "production" | "test";
  /** Hosts accepted by Better Auth when the public server URL is resolved dynamically. */
  allowedServerHosts?: string[] | undefined;
  /** Public server URL used when host-based resolution is disabled or cannot match. */
  fallbackServerUrl: string;
  /** Browser origins allowed to call auth endpoints. */
  corsOrigins: string[];
  /** Secret used by Better Auth to sign and verify sensitive auth data. */
  secret: string;
  /** Enables Polar checkout and customer portal integration. */
  paymentEnabled: boolean;
  /** Polar access token required when payments are enabled. */
  paymentAccessToken?: string | undefined;
  /** Checkout redirect URL required when payments are enabled. */
  paymentSuccessUrl?: string | undefined;
}

function createBetterAuth(options: CreateAuthOptions) {
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
    onAPIError: { throw: true },
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

/** Better Auth instance created by `createAuth`. */
export type Auth = ReturnType<typeof createBetterAuth>;

/**
 * Creates the server-side Better Auth instance for Dropaly.
 *
 * The instance enables email/password auth, Expo support, trusted app origins,
 * and optional Polar payments. Payment setup fails fast when enabled without the
 * required Polar token or checkout success URL.
 *
 * Development builds trust Expo URLs and use `http` for host-based base URL
 * resolution. Other environments use `https`.
 *
 * @throws Error when payments are enabled with incomplete payment configuration.
 */
export function createAuth(options: CreateAuthOptions): Auth {
  return createBetterAuth(options);
}

/** Authenticated session returned by Better Auth when a request is signed in. */
export type AuthSession = NonNullable<
  Awaited<ReturnType<Auth["api"]["getSession"]>>
>;

/** AuthenticatedUser data attached to an authenticated session. */
export type AuthSessionUser = AuthSession["user"];

/** Session metadata attached to an authenticated session. */
export type AuthSessionData = AuthSession["session"];
