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
        outDir: "./public/try-it-now",
        urlPrefix: "/try-it-now",
      },
    },
    {
      language: "python",
      sdkTarballPath: "../../sdks/mistral-python.tar.gz",
    },
  ],
};
