import { defineConfig } from "oxlint";

import { oxlintDefaultConfig } from "@dropaly/config/oxlint/oxlint.default";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  env: { builtin: true },
  ignorePatterns: [".agents/**", ".references/**"],
});
