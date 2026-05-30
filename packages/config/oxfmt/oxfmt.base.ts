import type { OxfmtConfig } from "oxfmt";

export const oxfmtBaseConfig = {
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
