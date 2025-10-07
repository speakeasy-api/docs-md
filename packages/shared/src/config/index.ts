export { getNodeESLintConfig } from "./eslint/node.ts";
export { getPlaywrightESLintConfig } from "./eslint/playwright.ts";
export { getReactEslintConfig } from "./eslint/react.ts";

export const prettierConfig = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
};
