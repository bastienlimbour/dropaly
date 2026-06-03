import { defineConfig } from "oxlint";

import { oxlintReactWebConfig } from "@dropaly/config/oxlint/oxlint.react-web";

export default defineConfig({
  extends: [oxlintReactWebConfig],
  env: { builtin: true, browser: true },
  rules: {
    "import/no-relative-parent-imports": "error",
  },
});
