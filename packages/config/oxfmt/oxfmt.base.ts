import type { OxfmtConfig } from "oxfmt";

export const oxfmtBaseConfig = {
  ignorePatterns: [
    ".agents/**",
    ".references/**",
    ".turbo/**",
    ".node_modules/**",
    "pnpm-lock.yaml",
    "skills-lock.json",
    "expo-env.d.ts",
    "uniwind-types.d.ts",
    "schema.d.ts",
    "openapi.json",
    "*.gen.ts",
  ],
  printWidth: 85,
  sortImports: {
    newlinesBetween: true,
    internalPattern: ["@/"],
    customGroups: [{ groupName: "monorepo", elementNamePattern: ["@dropaly/**"] }],
    groups: [
      "builtin",
      "external",
      "monorepo",
      ["internal", "subpath"],
      { newlinesBetween: false },
      ["parent", "sibling", "index"],
      "style",
      "unknown",
    ],
  },
  sortTailwindcss: { functions: ["cn", "clsx", "twMerge", "cva"] },
} satisfies OxfmtConfig;
