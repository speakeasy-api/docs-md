export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/api",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
    showDebugPlaceholders: true,
  },
  codeSamples: [
    {
      language: "typescript",
      packageName: "@mistralai/mistralai",
      enableTryItNow: true,
      sdkTarballPath: "../../sdks/mistral-typescript.tar.gz",
    },
    {
      language: "python",
      packageName: "mistralai",
      sdkTarballPath: "../../sdks/mistral-python.tar.gz",
    },
  ],
};
