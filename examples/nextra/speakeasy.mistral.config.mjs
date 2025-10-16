export default {
  spec: "../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/mistral/api",
    framework: "nextra",
  },
  codeSamples: [
    {
      language: "typescript",
      sdkFolder: "../sdks/mistral-typescript",
      tryItNow: {
        outDir: "./public/mistral-try-it-now",
        urlPrefix: "/mistral-try-it-now",
      },
    },
    {
      language: "python",
      sdkTarballPath: "../sdks/mistral-python.tar.gz",
    },
    {
      language: "curl",
    },
  ],
};
