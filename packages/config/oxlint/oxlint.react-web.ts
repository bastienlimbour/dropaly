import type { OxlintConfig } from "oxlint";

import { oxlintBaseConfig } from "./shared/oxlint.base.ts";
import { oxlintReactConfig } from "./shared/oxlint.react.ts";

/** Oxlint config for browser React packages with JSX accessibility checks. */
export const oxlintReactWebConfig = {
  extends: [oxlintBaseConfig, oxlintReactConfig],
  plugins: ["jsx-a11y"],
  rules: {
    "no-undef": "error",
  },
} satisfies OxlintConfig;
