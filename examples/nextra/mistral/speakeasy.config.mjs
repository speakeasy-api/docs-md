export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/api",
    framework: "nextra",
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
      packageManagerUrl: "/pkg",
      sampleDownloadUrl:
        "https://github.com/mistralai/client-ts/archive/refs/tags/v1.10.0.tar.gz",
    },
    {
      language: "python",
      sdkClassName: "Mistral",
      packageName: "mistralai",
      sampleDownloadUrl:
        "https://github.com/mistralai/client-python/archive/refs/tags/v1.9.10.tar.gz",
    },
  ],
};
