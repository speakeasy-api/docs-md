export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/api",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
  },
  codeSamples: [
    {
      language: "typescript",
      sdkClassName: "Mistral",
      packageName: "@mistralai/mistralai",
      enableTryItNow: true,
    },
    {
      language: "python",
      sdkClassName: "Mistral",
      packageName: "mistralai",
    },
  ],
};
