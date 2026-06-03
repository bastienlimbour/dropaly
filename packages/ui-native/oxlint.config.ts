import { defineConfig } from "oxlint";

import { oxlintReactNativeConfig } from "@dropaly/config/oxlint/oxlint.react-native";
import { noRestrictedImportsForPackage } from "@dropaly/config/oxlint/shared/oxlint.base";

export default defineConfig({
  extends: [oxlintReactNativeConfig],
  env: { builtin: true },
  ignorePatterns: ["uniwind-types.d.ts"],
  rules: {
    "no-restricted-imports": noRestrictedImportsForPackage("@dropaly/ui-native"),
  },
});
