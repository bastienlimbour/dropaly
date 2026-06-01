import { defineConfig } from "oxlint";

import { oxlintNodeConfig } from "@dropaly/config/oxlint/oxlint.node";

export default defineConfig({
  extends: [oxlintNodeConfig],
  env: { builtin: true, node: true },
});
