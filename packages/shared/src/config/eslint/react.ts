import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { getBaseESLintConfig } from "./base.ts";
import type { BaseESLintConfigOptions } from "./types.ts";

export function getReactEslintConfig(options: BaseESLintConfigOptions) {
  return [
    ...getBaseESLintConfig(options),
    pluginReact.configs.flat.recommended,
    reactHooks.configs["recommended-latest"],
    {
      languageOptions: {
        globals: globals.browser,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react-hooks/exhaustive-deps": "error",
      },
    },
    {
      rules: {
        "react/react-in-jsx-scope": "off",
      },
    },
  ];
}
