import { join, resolve } from "node:path";

import { getSettings } from "../../settings.ts";
import type { FrameworkConfig } from "../../types/FrameworkConfig.ts";

export const llmsConfig: FrameworkConfig = {
  rendererType: "markdown",

  buildPagePath(slug, { appendIndex = false } = {}) {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `llms-full.txt`));
  },

  buildPagePreamble() {
    return "";
  },

  formatHeadingId() {
    // Oddly enough, Nextra uses a different syntax for heading IDs than other
    // Markdown renderers
    return ``;
  },
};
