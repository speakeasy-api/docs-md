import { withGithubSdk } from "@speakeasy-api/docs-md";

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
    withGithubSdk(
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
      process.env.GITHUB_TOKEN
    ),
    {
      language: "curl",
    },
  ],
};
