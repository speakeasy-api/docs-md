import playwright from "eslint-plugin-playwright";
import globals from "globals";

import { getBaseESLintConfig } from "./base.ts";
import type { BaseESLintConfigOptions } from "./types.ts";

export function getPlaywrightESLintConfig(options: BaseESLintConfigOptions) {
  return [
    ...getBaseESLintConfig(options),
    playwright.configs["flat/recommended"],
    { languageOptions: { globals: globals.node } },
  ];
}
