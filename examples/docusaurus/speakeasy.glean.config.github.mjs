import { withGithubSdks, withGithubSpec } from "@speakeasy-api/docs-md";

const spec = await withGithubSpec({
  owner: "gleanwork",
  repo: "open-api",
  ref: "main",
  specPath: "final_specs/client_rest.yaml",
  token: process.env.GITHUB_TOKEN,
});

const sdkConfigs = await withGithubSdks({
  sdks: [
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
  token: process.env.GITHUB_TOKEN,
});

export default {
  ...spec,
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
