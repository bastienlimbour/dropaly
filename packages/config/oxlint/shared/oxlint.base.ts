import type { OxlintConfig } from "oxlint";

export const restrictedImportPatterns = [
  {
    regex: "^@dropaly/.*/src(/.*)?$",
    message: "Import workspace packages through their package exports.",
  },
  {
    regex: "^\\.\\./.*packages/",
    message: "Import workspace packages by package name instead of file path.",
  },
];

type RestrictedImportPattern =
  | (typeof restrictedImportPatterns)[number]
  | {
      group: string[];
      message: string;
    };

export function noRestrictedImportsForPackage(
  packageName: string,
): ["error", { patterns: RestrictedImportPattern[] }] {
  return [
    "error",
    {
      patterns: [
        ...restrictedImportPatterns,
        {
          group: [packageName, `${packageName}/**`],
          message: `Use relative imports inside ${packageName}; reserve ${packageName} imports for external consumers.`,
        },
      ],
    },
  ];
}

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
    // "import/no-cycle": ["warn", { maxDepth: 3 }],
    "import/no-cycle": "warn",
    "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
    "no-restricted-imports": ["error", { patterns: restrictedImportPatterns }],
  },
} satisfies OxlintConfig;
