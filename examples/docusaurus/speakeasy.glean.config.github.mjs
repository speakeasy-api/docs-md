import { withGithubSdks } from "@speakeasy-api/docs-md";

const sdkConfigs = await withGithubSdks(
  [
    {
      language: "typescript",
      owner: "gleanwork",
      repo: "api-client-typescript",
      version: "v0.11.2",
      tryItNow: {
        outDir: "./public/glean-try-it-now",
        urlPrefix: "/glean-try-it-now",
      },
    },
    {
      language: "curl",
    },
  ],
  process.env.GITHUB_TOKEN
);

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
  ...sdkConfigs,
};
