import { defineConfig } from "oxlint";

import { oxlintReactWebConfig } from "@dropaly/config/oxlint/oxlint.react-web";
import { noRestrictedImportsForPackage } from "@dropaly/config/oxlint/shared/oxlint.base";

export default defineConfig({
  extends: [oxlintReactWebConfig],
  env: { builtin: true, browser: true },
  rules: {
    "no-restricted-imports": noRestrictedImportsForPackage("@dropaly/ui-web"),
    "typescript/dot-notation": "error",
    "typescript/no-unsafe-return": "error",
  },
});
