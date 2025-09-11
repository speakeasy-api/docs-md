import { resolve } from "node:path";

import { getReactEslintConfig } from "@speakeasy-api/shared";
import { getDirname } from "cross-dirname";
import globals from "globals";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getReactEslintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "types/index.ts": /.*/,
    },
  // Since we're a mix of running in both Node.js and React, we override the
  // globals set by the React config to include Node.js globals as well.
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Disable unused exports rule for Storybook files
  {
    files: ["**/*.stories.{ts,tsx}", ".storybook/*.{ts,tsx}"],
    rules: {
      "fast-import/no-unused-exports": "off",
    },
  },
  // Disallow console calls in compiler code (use logging.ts functions instead)
  {
    files: ["src/compiler/**/*.{ts,js,mts,mjs}"],
    ignores: ["src/compiler/logging.ts"],
    rules: {
      "no-console": "error",
    },
  },
];
