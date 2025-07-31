export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "nextra",
  },
  display: {
    // visibleResponses: "success",
  },
  // The monorepo is causing some issues with multiple instances of...something
  // that causes Try It Now to crash
  // tryItNow: {
  //   npmPackageName: "@mistralai/mistralai",
  //   sdkClassName: "Mistral",
  // },
};
