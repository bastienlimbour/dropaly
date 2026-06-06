import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const booleanEnv = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

export const env = createEnv({
  clientPrefix: "VITE_",
  client: { VITE_SERVER_URL: z.url(), VITE_PAYMENTS_ENABLED: booleanEnv },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});

export type WebEnv = typeof env;
