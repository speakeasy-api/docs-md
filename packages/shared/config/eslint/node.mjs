import ava from "eslint-plugin-ava";
import globals from "globals";

import { getBaseESLintConfig } from "./base.mjs";

export function getNodeESLintConfig(options) {
  return [
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
}
