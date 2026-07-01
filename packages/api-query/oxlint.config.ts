import { defineConfig } from "oxlint";

import { oxlintDefaultConfig } from "@dropaly/config/oxlint/oxlint.default";
import { noRestrictedImportsForPackage } from "@dropaly/config/oxlint/shared/oxlint.base";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  env: { builtin: true },
  rules: {
    "no-restricted-imports": noRestrictedImportsForPackage("@dropaly/api-query"),
  },
});
