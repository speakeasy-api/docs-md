import { resolve } from "node:path";

import { getNodeESLintConfig } from "@speakeasy-api/config";
import { getDirname } from "cross-dirname";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getNodeESLintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "src/index.ts": ["Settings", "TryItNow", "SideBar", "SideBarCta"],
    },
    ignores: ["src/pages/data/wasm_exec.js"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: "node:fs",
        allowed: [/src\/cli\//],
        message:
          "File system access is only allowed in the CLI wrapper because other code is used in web environments",
      },
    ],
  }),
];
