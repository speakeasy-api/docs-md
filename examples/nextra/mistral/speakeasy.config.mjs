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
      sdkTarballPath: "../../sdks/mistral-typescript.tar.gz",
      tryItNow: {
        bundlePath: "./public/try-it-now/deps.js",
        bundleUrl: "/try-it-now/deps.js",
      },
    },
    {
      language: "python",
      sdkTarballPath: "../../sdks/mistral-python.tar.gz",
    },
  ],
};
