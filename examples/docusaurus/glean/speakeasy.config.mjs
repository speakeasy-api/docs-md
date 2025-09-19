export default {
  spec: "../../specs/glean.yaml",
  output: {
    pageOutDir: "./docs/api",
    embedoutDir: "./src/components/speakeasy-embeds",
    framework: "docusaurus",
  },
  display: {
    visibleResponses: "success",
    maxNestingLevel: 2,
  },
};
