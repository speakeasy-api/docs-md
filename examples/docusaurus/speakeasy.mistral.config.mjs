export default {
  spec: "../specs/mistral.yaml",
  output: {
    pageOutDir: "./docs/mistral/api",
    framework: "docusaurus",
  },
  display: {
    showDebugPlaceholders: true,
  },
  codeSamples: [
    {
      language: "typescript",
      sdkTarballPath: "../sdks/mistral-typescript.tar.gz",
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
      tryItNow: true,
    },
  ],
};
