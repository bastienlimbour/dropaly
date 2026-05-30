import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { booleanEnv } from "./utils";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: { VITE_SERVER_URL: z.url(), VITE_PAYMENTS_ENABLED: booleanEnv },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
