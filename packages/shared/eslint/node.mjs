import globals from "globals";
import { getBaseESLintConfig } from "./base.mjs";
import ava from "eslint-plugin-ava";

export const getNodeESLintConfig = (options) => [
  ...getBaseESLintConfig(options),
  ava.configs["flat/recommended"],
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // This rule doesn't support TypeScript tests
      "ava/no-ignored-test-files": "off",
    },
  },
];
