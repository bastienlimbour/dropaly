import { defineConfig } from "oxfmt";

import { oxfmtBaseConfig } from "@dropaly/config/oxfmt/oxfmt.base";

export default defineConfig({
  ...oxfmtBaseConfig,
  ignorePatterns: [
    ".agents/**",
    ".turbo/**",
    ".node_modules/**",
    "pnpm-lock.yaml",
    "skills-lock.json",
    "expo-env.d.ts",
    "uniwind-types.d.ts",
    "*.gen.ts",
  ],
});
