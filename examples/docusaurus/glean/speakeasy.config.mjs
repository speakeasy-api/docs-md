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
    },
  ],
};
