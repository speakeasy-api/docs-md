export default {
  spec: "../../specs/glean.yaml",
  output: {
    pageOutDir: "./docs/api",
    embedOutDir: "./src/components/speakeasy-embeds",
    framework: "docusaurus",
  },
  display: {
    maxNestingLevel: 2,
  },
  codeSamples: [
    {
      language: "typescript",
      sdkTarballPath: "../../sdks/glean-typescript.tar.gz",
      tryItNow: {
        outDir: "./public/try-it-now",
        urlPrefix: "/try-it-now",
      },
    },
    {
      language: "curl",
    },
  ],
};
