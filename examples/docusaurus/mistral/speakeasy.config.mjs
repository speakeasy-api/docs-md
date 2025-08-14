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
  tryItNow: {
    npmPackageName: "@mistralai/mistralai",
    sdkClassName: "Mistral",
  },
};
