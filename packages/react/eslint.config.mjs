import { resolve } from "node:path";

import { getReactEslintConfig } from "@speakeasy-api/docs-md-shared/config";
import { getDirname } from "cross-dirname";
import globals from "globals";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getReactEslintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "src/index.ts": /.*/,
    },
    ignores: ["src/compiler/data/wasm_exec.js", "src/.storybook/**/*"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: /^node:/,
        denied: [/src\/react\//],
        message:
          "React components run in an environment that doesn't have access to Node.js modules",
      },
    ],
  }),
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
