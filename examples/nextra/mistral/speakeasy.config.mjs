export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "nextra",
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
