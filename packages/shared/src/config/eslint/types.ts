export type BaseESLintConfigOptions = {
  gitignorePaths: string | string[];
  rootDir: string;
  entryPoints: Record<string, RegExp | string[]>;
  ignores?: string[];
  restrictedImports?: {
    name: string;
    message?: string;
  }[];
};
