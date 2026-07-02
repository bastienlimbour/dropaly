import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const commaSeparatedListToArray = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().min(1)).min(1));

const commeaSeparatedListToUrlArray = commaSeparatedListToArray
  .pipe(z.array(z.url()).min(1))
  .transform((urls) => [...new Set(urls.map((url) => new URL(url).origin))]);

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SERVER_HOST: z.string().min(1),
    SERVER_PORT: z.coerce.number().int().min(1).max(65535),
    API_RESPONSE_DELAY_MS: z.coerce.number().int().min(0).default(0),
    DATABASE_URL: z.string().min(1),
    CORS_ORIGINS: commeaSeparatedListToUrlArray,
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_ALLOWED_HOSTS: commaSeparatedListToArray.optional(),
    BETTER_AUTH_SECRET: z.string().min(32),
    PAYMENT_ENABLED: z.stringbool(),
    POLAR_SUCCESS_URL: z.url().optional(),
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type ServerEnv = typeof env;
