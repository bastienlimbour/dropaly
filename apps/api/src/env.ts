import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanEnv = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const commaSeparatedListEnv = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().min(1)).min(1));

const commaSeparatedUrlOriginsEnv = commaSeparatedListEnv
  .pipe(z.array(z.url()).min(1))
  .transform((urls) => [...new Set(urls.map((url) => new URL(url).origin))]);

export const env = createEnv({
  server: {
    SERVER_HOST: z.string().min(1),
    SERVER_PORT: z.coerce.number().int().min(1).max(65535),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_ALLOWED_HOSTS: commaSeparatedListEnv.optional(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    CORS_ORIGINS: commaSeparatedUrlOriginsEnv,
    PAYMENTS_ENABLED: booleanEnv,
    POLAR_SUCCESS_URL: z.url().optional(),
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type ServerEnv = typeof env;
