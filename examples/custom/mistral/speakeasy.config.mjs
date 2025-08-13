import { join, resolve } from "node:path";

import {
  getSettings,
  MdxRenderer,
  MdxSite,
} from "@speakeasy-api/docs-md/compiler";

export class MistralSite extends MdxSite {
  buildPagePath(slug, { appendIndex = false } = {}) {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  getRenderer(options) {
    return new MistralRenderer({ ...options });
  }
}

class MistralRenderer extends MdxRenderer {
  constructor(args) {
    super(args);
    this.insertPackageImport("@/app/speakeasy.css");
  }

  insertComponentImport(symbol) {
    this.insertNamedImport("@/components/speakeasy", symbol);
  }

  getIdSeparator() {
    return "_";
  }
}

export default {
  spec: "../../specs/mistral.yaml",
  output: {
    pageOutDir: "./src/app/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "custom",
    createSite() {
      return new MistralSite();
    },
  },
  tryItNow: {
    npmPackageName: "@mistralai/mistralai",
    sdkClassName: "Mistral",
  },
};
