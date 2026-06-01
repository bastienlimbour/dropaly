import { defineConfig } from "oxlint";

import { oxlintReactNativeConfig } from "@dropaly/config/oxlint/oxlint.react-native";

export default defineConfig({
  extends: [oxlintReactNativeConfig],
  env: { builtin: true },
});
