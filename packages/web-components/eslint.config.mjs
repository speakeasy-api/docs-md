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
        message: "Node.js modules are not allowed in web components",
      },
    ],
  }),
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "no-console": "error",
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Disallow console calls
  {
    files: ["src/**/*"],
    rules: {
      "no-console": "error",
    },
  },
];
