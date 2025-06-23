import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import unusedImports from "eslint-plugin-unused-imports";
import { includeIgnoreFile } from "@eslint/compat";
import { all } from "eslint-plugin-fast-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { globalIgnores } from "eslint/config";

export const getBaseESLintConfig = ({
  gitignorePaths,
  rootDir,
  entryPoints,
  ignores,
  restrictedImports,
}) => {
  if (!Array.isArray(gitignorePaths)) {
    gitignorePaths = [gitignorePaths];
  }
  return [
    ...gitignorePaths.map(includeIgnoreFile),
    eslint.configs.recommended,
    eslintConfigPrettier,
    ...(ignores ? [globalIgnores(ignores)] : []),
    all({ rootDir, entryPoints }),
    ...(restrictedImports
      ? [
          {
            files: ["**/*.{ts,tsx,mts}"],
            rules: {
              "fast-import/no-restricted-imports": [
                "error",
                {
                  rules: restrictedImports,
                },
              ],
            },
          },
        ]
      : undefined),
    ...tseslint.configs.recommendedTypeChecked,
    {
      files: ["**/*.{ts,tsx,mts}"],
      languageOptions: {
        parserOptions: {
          projectService: true,
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

        // TODO: Currently this crashes and so we have to turn it off. It was fixed previously at
        // https://github.com/typescript-eslint/typescript-eslint/issues/10338, but seems to have regressed
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ];
};
