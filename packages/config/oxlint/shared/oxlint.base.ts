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
    "func-name-matching": "warn",
    // "func-names": ["warn", "as-needed"],
    // "func-style": ["warn", "declaration"],
    "no-restricted-imports": ["error", { patterns: restrictedImportPatterns }],
    "oxc/no-async-endpoint-handlers": "off",
    "prefer-const": "warn",
    "unicorn/no-typeof-undefined": "warn",
    "import/namespace": "off",
    "import/no-cycle": "warn",
    // "import/no-cycle": ["warn", { maxDepth: 3 }],
    "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
    "import/consistent-type-specifier-style": "warn",
    "typescript/consistent-type-definitions": ["warn", "interface"],
    "typescript/consistent-type-exports": "warn",
    "typescript/consistent-type-imports": "warn",
    "typescript/consistent-return": "off",
    "typescript/no-empty-interface": "warn",
    "typescript/no-empty-object-type": "warn",
    "typescript/no-import-type-side-effects": "warn",
    "typescript/no-inferrable-types": "warn",
    "typescript/no-non-null-asserted-nullish-coalescing": "warn",
    "typescript/no-unnecessary-condition": "warn",
    "typescript/no-unsafe-function-type": "warn",
    "typescript/non-nullable-type-assertion-style": "warn",
    "typescript/prefer-function-type": "warn",
    "typescript/prefer-nullish-coalescing": "warn",
    "typescript/return-await": ["warn", "error-handling-correctness-only"],
    "unicorn/prefer-includes": "warn",
    // "typescript/no-non-null-assertion": "warn",
    // "typescript/no-misused-promises": [
    //   "warn",
    //   {
    //     checksConditionals: true,
    //     checksSpreads: true,
    //     checksVoidReturn: false, // Seen in oxlint-config-universe
    //     checksVoidReturn: {
    //       arguments: true,
    //       attributes: false, // recommended to avoid false positives
    //       properties: true,
    //       returns: true,
    //       variables: true,
    //       inheritedMethods: true,
    //     },
    //   },
    // ],
  },
} satisfies OxlintConfig;
