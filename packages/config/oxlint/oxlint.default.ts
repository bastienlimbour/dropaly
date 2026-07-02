import type { OxlintConfig } from "oxlint";

import { oxlintBaseConfig } from "./shared/oxlint.base.ts";

/** Default Oxlint config for packages without platform-specific rules. */
export const oxlintDefaultConfig = {
  extends: [oxlintBaseConfig],
} satisfies OxlintConfig;
