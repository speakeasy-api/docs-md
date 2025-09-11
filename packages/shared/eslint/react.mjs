import globals from "globals";
import { getBaseESLintConfig } from "./base.mjs";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export const getReactEslintConfig = (options) => [
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
