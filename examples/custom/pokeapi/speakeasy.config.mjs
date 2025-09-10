import { join, resolve } from "node:path";
import { writeFileSync } from "node:fs";

import {
  getSettings,
  MdxRenderer,
  MdxSite,
} from "@speakeasy-api/docs-md/compiler";

class PokeAPISite extends MdxSite {
  buildPagePath(slug) {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  getRenderer(options) {
    return new PokeAPIRenderer({ ...options });
  }

  // This method is called after all pages have been rendered. It contains
  // metadata about the pages that were rendered and can be used to construct a
  // left navigation sidebar.
  processPageMetadata(metadata) {
    // Note: the format for this data is very much a quick and dirty
    // implementation. It's shape will almost certainly change and become easier
    // to work with in the future.
    writeFileSync(
      "./src/components/sidebarMetadata.json",
      JSON.stringify(metadata, null, "  ")
    );
  }
}

class PokeAPIRenderer extends MdxRenderer {
  constructor(args) {
    super(args);
    this.insertPackageImport("@/app/speakeasy.css");
  }

  insertComponentImport(symbol) {
    this.insertNamedImport("@/components/speakeasy-custom", symbol);
  }

  getIdSeparator() {
    return "_";
  }
}

export default {
  spec: "../../specs/pokeapi.yml",
  output: {
    pageOutDir: "./src/app/api",
    framework: "custom",
    createSite() {
      return new PokeAPISite();
    },
  },
  display: {
    visibleResponses: "success",
    showDebugPlaceholders: false,
    expandTopLevelPropertiesOnPageLoad: true,
  },
};
