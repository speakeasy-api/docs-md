export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "docusaurus",
  },
  display: {
    // visibleResponses: "success",
    showDebugPlaceholders: false,
  },
  // The monorepo is causing some issues with multiple instances of...something
  // that causes Try It Now to crash
  // tryItNow: {
  //   npmPackageName: "@mistralai/mistralai",
  //   sdkClassName: "Mistral",
  // },
};
