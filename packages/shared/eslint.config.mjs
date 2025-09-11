import { resolve } from "node:path";

import { getDirname } from "cross-dirname";

import { getNodeESLintConfig } from "./index.mjs";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getNodeESLintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "index.mjs": /.*/,
      "types/index.ts": /.*/,
    },
    ignores: ["src/compiler/data/wasm_exec.js"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: "node:fs",
        allowed: [/src\/compiler\/cli\//],
        message:
          "File system access is only allowed in the CLI wrapper because other code should be kept isomorphic",
      },
    ],
  }),
];
