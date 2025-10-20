import { join, resolve } from "node:path";
import { writeFileSync } from "node:fs";

import { getSettings } from "@speakeasy-api/docs-md";

/**
 * @type {import("@speakeasy-api/docs-md").FrameworkConfig}
 */
const framework = {
  rendererType: "mdx",
  componentPackageName: "@/components/speakeasy-custom",
  stringAttributeEscapeStyle: "react-value",
  elementIdSeparator: "_",

  buildPagePath(slug) {
    const settings = getSettings();
    const slugName = slug && slug !== "" ? slug : "index";
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  },

  buildPagePreamble() {
    const preamble = `
---
layout: "@/layouts/mistralLayout.astro"
---
import "@/styles/speakeasy.css";
    `;
    return preamble;
  },

  postProcess(metadata) {
    // Note: the format for this data is very much a quick and dirty
    // implementation. It's shape will almost certainly change and become easier
    // to work with in the future.
    writeFileSync(
      "./src/data/mistral/sidebarMetadata.json",
      JSON.stringify(metadata, null, "  ")
    );
  },
};

export default {
  spec: "../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/pages/mistral/api",
    framework,
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
    },
  ],
};
