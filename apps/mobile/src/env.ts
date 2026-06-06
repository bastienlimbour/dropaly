import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_API_URL: z.url(),
    EXPO_PUBLIC_PAYMENT_ENABLED: z.stringbool(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type MobileEnv = typeof env;
