import type { OxfmtConfig } from "oxfmt";

/**
 * Shared formatter config for Dropaly workspaces.
 *
 * Generated artifacts and local AI/reference folders are ignored so formatting
 * stays focused on source files maintained by the repo.
 */
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
