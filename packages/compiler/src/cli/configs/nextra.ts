import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { escapeText } from "../../renderers/util.ts";
import { getSettings } from "../../settings.ts";
import type { FrameworkConfig } from "../../types/compilerConfig.ts";

export const nextraConfig: FrameworkConfig = {
  rendererType: "mdx",
  componentPackageName: "@speakeasy-api/docs-md-react",
  elementIdSeparator: "_",

  buildPagePath(slug) {
    const settings = getSettings();
    // Do nothing with `appendIndex`, since our appending of `/page.mdx`
    // implicitly handles the index case.
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  },

  buildPagePreamble(frontMatter) {
    return `---
sidebarTitle: ${escapeText(frontMatter.sidebarLabel, { escape: "mdx" })}
---

import "@speakeasy-api/docs-md-react/nextra.css";
`;
  },

  postProcess() {
    const settings = getSettings();
    const config = `export default {
      index: { title: "About", theme: { collapsed: false } },
      endpoint: { title: "Operations", theme: { collapsed: false } }
    }`;
    mkdirSync(join(settings.output.pageOutDir, "endpoint"), {
      recursive: true,
    });
    writeFileSync(join(settings.output.pageOutDir, "_meta.ts"), config);
  },

  formatHeadingId(id) {
    // Oddly enough, Nextra uses a different syntax for heading IDs than other
    // Markdown renderers
    return `[#${id}]`;
  },
};
