export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
    showDebugPlaceholders: false,
    expandTopLevelPropertiesOnPageLoad: true,
  },
  tryItNow: [
    {
      language: "typescript",
      sdkClassName: "Mistral",
      packageName: "@mistralai/mistralai",
    },
    {
      language: "python",
      sdkClassName: "Mistral",
      packageName: "mistralai",
    },
  ],
};
