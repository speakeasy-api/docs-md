export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/api",
    embedoutDir: "./src/components/speakeasy-embeds",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
    showDebugPlaceholders: true,
    maxNestingLevel: 2,
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
