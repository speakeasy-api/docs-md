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
    return resolve(join(settings.output.pageOutDir, `${slugName}.mdx`));
  },

  buildPagePreamble() {
    const preamble = `
---
layout: "@/layouts/pokeApi.astro"
---
`;
    return preamble;
  },

  postProcess(metadata) {
    // Note: the format for this data is very much a quick and dirty
    // implementation. It's shape will almost certainly change and become easier
    // to work with in the future.
    writeFileSync(
      "./src/data/pokeapi/sidebarMetadata.json",
      JSON.stringify(metadata, null, "  ")
    );
  },
};

export default {
  spec: "../specs/pokeapi.yml",
  output: {
    pageOutDir: "./src/pages/pokeapi/api",
    framework,
  },
};
