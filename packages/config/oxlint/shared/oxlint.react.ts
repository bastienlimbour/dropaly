import type { OxlintConfig } from "oxlint";

/** Shared React lint rules used by web and native packages. */
export const oxlintReactConfig = {
  plugins: ["react"],
  settings: {
    react: { version: "19.2" },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/button-has-type": "warn",
    "react/prefer-function-component": "warn",
    "react/rules-of-hooks": "warn",
  },
} satisfies OxlintConfig;
