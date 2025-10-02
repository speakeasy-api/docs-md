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
      packageName: "@mistralai/mistralai",
      enableTryItNow: true,
      sdkTarballPath: "../../sdks/mistral-typescript.tar.gz",
      tryItNowBundlePath: "./public/try-it-now/deps.js",
      tryItNowBundleUrl: "/try-it-now/deps.js",
    },
    {
      language: "python",
      packageName: "mistralai",
      sdkTarballPath: "../../sdks/mistral-python.tar.gz",
    },
  ],
};
