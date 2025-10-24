import { resolve } from "node:path";

import { getPlaywrightESLintConfig } from "@speakeasy-api/docs-md-shared/config";
import { getDirname } from "cross-dirname";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getPlaywrightESLintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "playwright.config.ts": /.*/,
    },
    ignores: ["test-results/**", "playwright-report/**"],
    restrictedImports: [],
  }),
];
