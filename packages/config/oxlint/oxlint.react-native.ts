import type { OxlintConfig } from "oxlint";

import { oxlintBaseConfig } from "./shared/oxlint.base.ts";
import { oxlintReactConfig } from "./shared/oxlint.react.ts";

export const oxlintReactNativeConfig = {
  extends: [oxlintBaseConfig, oxlintReactConfig],
} satisfies OxlintConfig;
