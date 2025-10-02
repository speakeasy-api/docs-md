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
        moduleSpecifier: "node:fs",
        allowed: [/src\/compiler\/cli\//],
        message:
          "File system access is only allowed in the CLI wrapper because other code is used in web environments",
      },
      {
        type: "first-party",
        filepath: /src\/compiler\//,
        allowed: [/src\/compiler\//],
        message: "Only compiler code is allowed to import compiler code",
      },
      {
        type: "third-party",
        moduleSpecifier: /^node:/,
        denied: [/src\/react\//],
        message:
          "React components run in an environment that doesn't have access to Node.js modules",
      },
      {
        type: "first-party",
        filepath: /src\/react/,
        allowed: [/src\/react\//],
        message: "Only React code is allowed to import React code",
        excludeTypeImports: true,
      },
    ],
  }),
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "fast-import/no-restricted-imports": [
        "warn",
        {
          rules: [
            {
              type: "first-party",
              filepath: /src\/components\/([a-zA-Z0-9-_]+)\/.*\.tsx?$/,
              allowed: [/src\/components\/$1\/.*\.tsx?$/, /src\/index\.tsx?$/],
              excludeTypeImports: true,
              message:
                "Reminder: any time a top-level component imports another top-level component, it should be taken in as a runtime value that can be overridden. Use eslint-disable-next-line once there is an overridable property.",
            },
          ],
        },
      ],
      "no-console": "error",
    },
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
