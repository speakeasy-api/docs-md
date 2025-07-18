export default {
  spec: "./openapi_with_overlays.yaml",
  output: {
    pageOutDir: "./docs/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
  },
  // The monorepo is causing some issues with multiple instances of...something
  // that causes Try It Now to crash
  // tryItNow: {
  //   npmPackageName: "@mistralai/mistralai",
  //   sdkClassName: "Mistral",
  // },
};
