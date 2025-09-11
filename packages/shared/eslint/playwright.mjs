import globals from "globals";
import { getBaseESLintConfig } from "./base.mjs";
import playwright from "eslint-plugin-playwright";

export const getPlaywrightESLintConfig = (options) => [
  ...getBaseESLintConfig(options),
  playwright.configs["flat/recommended"],
  { languageOptions: { globals: globals.node } },
];
