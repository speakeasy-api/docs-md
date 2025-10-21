// Import workspace-specific configs
import compilerConfig from "./packages/compiler/eslint.config.mjs";
import reactConfig from "./packages/react/eslint.config.mjs";
import sharedConfig from "./packages/shared/eslint.config.mjs";

export default [
  // Global ignores for the entire monorepo
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "scaffold-templates/**",
      "examples/**",
    ],
  },

  // Apply compiler config to compiler package
  ...compilerConfig.map((config) => ({
    ...config,
    files: config.files
      ? config.files.map((f) => `packages/compiler/${f}`)
      : ["packages/compiler/**/*"],
  })),

  // Apply react config to react package
  ...reactConfig.map((config) => ({
    ...config,
    files: config.files
      ? config.files.map((f) => `packages/react/${f}`)
      : ["packages/react/**/*"],
  })),

  // Apply shared config to shared package
  ...sharedConfig.map((config) => ({
    ...config,
    files: config.files
      ? config.files.map((f) => `packages/shared/${f}`)
      : ["packages/shared/**/*"],
  })),
];
