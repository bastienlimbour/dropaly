import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.url(),
    VITE_PAYMENT_ENABLED: z.stringbool(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});

export type WebEnv = typeof env;
