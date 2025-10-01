import { join, resolve } from "node:path";
import { writeFileSync } from "node:fs";

import { getSettings } from "@speakeasy-api/docs-md";

/**
 * @type {import("@speakeasy-api/docs-md").FrameworkConfig}
 */
const framework = {
  rendererType: "mdx",
  componentPackageName: "@/components/speakeasy-custom",
  elementIdSeparator: "_",

  buildPagePath(slug) {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  },

  buildPagePreamble() {
    return `import "@/app/speakeasy.css";`;
  },

  postProcess(metadata) {
    // Note: the format for this data is very much a quick and dirty
    // implementation. It's shape will almost certainly change and become easier
    // to work with in the future.
    writeFileSync(
      "./src/components/sidebarMetadata.json",
      JSON.stringify(metadata, null, "  ")
    );
  },
};

export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/api",
    framework,
    singlePage: true,
  },
  display: {
    visibleResponses: "success",
  },
  codeSamples: [
    {
      language: "typescript",
      sdkClassName: "Mistral",
      packageName: "@mistralai/mistralai",
      enableTryItNow: true,
      packageManagerUrl: "/pkg",
      sampleDownloadUrl:
        "https://github.com/mistralai/client-ts/archive/refs/tags/v1.10.0.tar.gz",
    },
    {
      language: "python",
      sdkClassName: "Mistral",
      packageName: "mistralai",
      sampleDownloadUrl:
        "https://github.com/mistralai/client-python/archive/refs/tags/v1.9.10.tar.gz",
    },
  ],
};
