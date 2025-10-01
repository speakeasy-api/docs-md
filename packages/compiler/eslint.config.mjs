import { resolve } from "node:path";

import { getNodeESLintConfig } from "@speakeasy-api/docs-md-shared/config";
import { getDirname } from "cross-dirname";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getNodeESLintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "src/compiler.ts": /.*/,
      "src/editor/editor.ts": /.*/,
    },
    ignores: ["src/data/wasm_exec.js"],
    restrictedImports: [],
  }),
  // Disallow console calls in compiler code (use logging.ts functions instead)
  {
    files: ["src/**/*.{ts,js,mts,mjs}"],
    ignores: ["src/logging.ts"],
    rules: {
      "no-console": "error",
    },
  },
];
