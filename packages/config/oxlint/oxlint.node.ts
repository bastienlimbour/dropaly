import type { OxlintConfig } from "oxlint";

import { oxlintBaseConfig } from "./shared/oxlint.base.ts";
import { oxlintReactConfig } from "./shared/oxlint.react.ts";

/** Oxlint config for server-side packages that may still contain JSX utilities. */
export const oxlintNodeConfig = {
  extends: [oxlintBaseConfig, oxlintReactConfig],
  plugins: ["node"],
} satisfies OxlintConfig;
