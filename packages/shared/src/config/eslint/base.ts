import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import type { Linter } from "eslint";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { all } from "eslint-plugin-fast-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

import type { BaseESLintConfigOptions } from "./types.ts";

export function getBaseESLintConfig({
  gitignorePaths,
  rootDir,
  entryPoints,
  ignores,
  restrictedImports,
}: BaseESLintConfigOptions): Linter.Config[] {
  if (!Array.isArray(gitignorePaths)) {
    gitignorePaths = [gitignorePaths];
  }
  const config: Linter.Config[] = [
    ...gitignorePaths.map((ignoreFilePath) =>
      includeIgnoreFile(ignoreFilePath)
    ),
    eslint.configs.recommended,
    eslintConfigPrettier,
    ...(ignores ? [globalIgnores(ignores)] : []),
    all({ rootDir, entryPoints }),
    {
      files: ["**/*.{ts,tsx,mts}"],
      rules: {
        "fast-import/consistent-file-extensions": [
          "error",
          {
            mode: "always",
            forceTsExtension: true,
          },
        ],
      },
    },
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      files: ["**/*.{ts,tsx,mts}"],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: rootDir,
        },
      },
    },
    {
      plugins: {
        "simple-import-sort": simpleImportSort,
      },
      rules: {
        "simple-import-sort/imports": "error",
      },
    },
    {
      files: ["**/*.{js,jsx,mjs}"],
      ...tseslint.configs.disableTypeChecked,
    },
    {
      plugins: {
        "unused-imports": unusedImports,
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            vars: "all",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
        "no-return-assign": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "func-style": [
          "error",
          "declaration",
          {
            allowArrowFunctions: false,
          },
        ],

        // TODO: Currently this crashes and so we have to turn it off. It was fixed previously at
        // https://github.com/typescript-eslint/typescript-eslint/issues/10338, but seems to have regressed
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ];

  if (restrictedImports) {
    config.push({
      files: ["**/*.{ts,tsx,mts}"],
      rules: {
        "fast-import/no-restricted-imports": [
          "error",
          {
            rules: restrictedImports,
          },
        ],
      },
    });
  }

  return config;
}
