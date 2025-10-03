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
      sdkFolder: "../../sdks/mistral-typescript",
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
