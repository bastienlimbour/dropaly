import type { OxlintConfig } from "oxlint";

import { oxlintBaseConfig } from "./shared/oxlint.base.ts";

export const oxlintDefaultConfig = {
  extends: [oxlintBaseConfig],
} satisfies OxlintConfig;
