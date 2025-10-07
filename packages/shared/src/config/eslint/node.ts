import globals from "globals";

import { getBaseESLintConfig } from "./base.ts";
import type { BaseESLintConfigOptions } from "./types.ts";

export function getNodeESLintConfig(options: BaseESLintConfigOptions) {
  return [
    ...getBaseESLintConfig(options),
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
