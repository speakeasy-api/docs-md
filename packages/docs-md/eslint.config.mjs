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
      "src/index.ts": [
        "Settings",
        "TryItNow",
        "SideBar",
        "SideBarTrigger",
        "Site",
        "Renderer",
        "MarkdownSite",
        "MarkdownRenderer",
        "MdxSite",
        "MdxRenderer",
      ],
    },
    ignores: ["src/pages/data/wasm_exec.js", ".storybook/**/*"],
    restrictedImports: [
      {
        type: "third-party",
        moduleSpecifier: "node:fs",
        allowed: [/src\/cli\//],
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
    ],
  }),
  // Disable unused exports rule for Storybook files
  {
    files: ["**/*.stories.{ts,tsx}", ".storybook/*.{ts,tsx}"],
    rules: {
      "fast-import/no-unused-exports": "off",
    },
  },
];
