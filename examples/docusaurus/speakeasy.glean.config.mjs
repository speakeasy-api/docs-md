export default {
  spec: "../specs/glean.yaml",
  output: {
    pageOutDir: "./docs/glean/api",
    embedOutDir: "./src/components/glean-embeds",
    framework: "docusaurus",
  },
  display: {
    maxNestingLevel: 2,
  },
  codeSamples: [
    {
      language: "typescript",
      sdkTarballPath: "../sdks/glean-typescript.tar.gz",
      tryItNow: {
        outDir: "./public/glean-try-it-now",
        urlPrefix: "/glean-try-it-now",
      },
    },
    {
      language: "curl",
    },
  ],
};
