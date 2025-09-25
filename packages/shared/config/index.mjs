export { getNodeESLintConfig } from "./eslint/node.mjs";
export { getPlaywrightESLintConfig } from "./eslint/playwright.mjs";
export { getReactEslintConfig } from "./eslint/react.mjs";

export const prettierConfig = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
};
