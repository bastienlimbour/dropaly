import { defineConfig } from "oxlint";

import { oxlintReactWebConfig } from "@dropaly/config/oxlint/oxlint.react-web";

export default defineConfig({
  extends: [oxlintReactWebConfig],
  env: { builtin: true, browser: true },
  rules: {
    "typescript/dot-notation": "error",
    "typescript/no-unsafe-return": "error",
  },
});
