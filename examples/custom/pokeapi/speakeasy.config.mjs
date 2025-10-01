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
  spec: "../../specs/pokeapi.yml",
  output: {
    pageOutDir: "./src/app/api",
    framework,
  },
  display: {
    visibleResponses: "success",
    showDebugPlaceholders: false,
    expandTopLevelPropertiesOnPageLoad: true,
  },
  // Uncomment and set to a hosted archive (zip or tar.gz) containing markdown
  // usage snippets with <!-- UsageSnippet ... --> markers to load pre-built
  // code samples directly.
  // codeSamples: [
  //   "https://example.com/path/to/sdk-snippets.tar.gz",
  // ],
};
