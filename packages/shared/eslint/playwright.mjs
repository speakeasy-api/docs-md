import playwright from "eslint-plugin-playwright";
import globals from "globals";

import { getBaseESLintConfig } from "./base.mjs";

export function getPlaywrightESLintConfig(options) {
  return [
    ...getBaseESLintConfig(options),
    playwright.configs["flat/recommended"],
    { languageOptions: { globals: globals.node } },
  ];
}
