import { resolve } from "node:path";

import { getNodeESLintConfig } from "@speakeasy-api/docs-md-shared";
import { getDirname } from "cross-dirname";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getNodeESLintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "src/compiler/compiler.ts": /.*/,
    },
    ignores: ["src/compiler/data/wasm_exec.js"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: "node:fs",
        allowed: [/src\/compiler\/cli\//],
        message:
          "File system access is only allowed in the CLI wrapper because other code needs to be isomorphic",
      },
    ],
  }),
  // Disallow console calls in compiler code (use logging.ts functions instead)
  {
    files: ["src/compiler/**/*.{ts,js,mts,mjs}"],
    ignores: ["src/compiler/logging.ts"],
    rules: {
      "no-console": "error",
    },
  },
];
