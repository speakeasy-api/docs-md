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
  tryItNow: [
    {
      language: "typescript",
      sdkClassName: "Mistral",
      packageName: "@mistralai/mistralai",
    },
    {
      language: "python",
      sdkClassName: "Mistral",
      packageName: "mistralai",
    },
  ],
};
