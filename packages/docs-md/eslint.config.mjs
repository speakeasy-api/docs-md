import { resolve } from "node:path";

import { getReactEslintConfig } from "@speakeasy-api/config";
import { getDirname } from "cross-dirname";
import globals from "globals";

const gitignorePath = resolve(getDirname(), "..", "..", ".gitignore");

export default [
  ...getReactEslintConfig({
    gitignorePaths: gitignorePath,
    rootDir: getDirname(),
    entryPoints: {
      "eslint.config.mjs": ["default"],
      "src/runtime/nextra.ts": /.*/,
      "src/runtime/docusaurus.ts": /.*/,
      "src/runtime/react.ts": /.*/,
    },
    ignores: ["src/compiler/data/wasm_exec.js", ".storybook/**/*"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: "node:fs",
        allowed: [/src\/compiler\/cli\//],
        message:
          "File system access is only allowed in the CLI wrapper because other code is used in web environments",
      },
      {
        type: "third-party",
        moduleSpecifier: /^node:/,
        denied: [/src\/components\//],
        message:
          "Components run in an environment that doesn't have access to Node.js modules",
      },
      {
        type: "first-party",
        filepath: /src\/runtime/,
        allowed: [/src\/runtime\//],
        message: "Only runtime code is allowed to import runtime code",
      },
      {
        type: "first-party",
        filepath: /src\/compiler\//,
        allowed: [/src\/compiler\//],
        message: "Only compiler code is allowed to import compiler code",
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
];
