import type { OxlintConfig } from "oxlint";

export const oxlintBaseConfig = {
  plugins: ["typescript", "oxc", "eslint", "unicorn", "import", "promise"],
  options: {
    typeAware: true,
  },
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "import/namespace": "off",
    "import/no-cycle": ["warn", { maxDepth: 3 }],
    "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
  },
} satisfies OxlintConfig;
