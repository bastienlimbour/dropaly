import { defineConfig } from "oxlint";

import { oxlintNodeConfig } from "@dropaly/config/oxlint/oxlint.node";
import { noRestrictedImportsForPackage } from "@dropaly/config/oxlint/shared/oxlint.base";

export default defineConfig({
  extends: [oxlintNodeConfig],
  env: { builtin: true, node: true },
  rules: {
    "no-restricted-imports": noRestrictedImportsForPackage("@dropaly/auth"),
  },
});
