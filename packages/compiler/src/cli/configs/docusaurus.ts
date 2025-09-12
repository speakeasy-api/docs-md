import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { escapeText } from "../../renderers/util.ts";
import { getSettings } from "../../settings.ts";
import type { CompilerConfig } from "../../types/compilerConfig.ts";

export const docusaurusConfig: CompilerConfig = {
  rendererType: "mdx",
  componentPackageName: "@speakeasy-api/docs-md-react",

  buildPagePath(slug, { appendIndex = false } = {}) {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  },

  buildPagePreamble(frontMatter) {
    return `---
sidebar_position: ${frontMatter.sidebarPosition}
sidebar_label: ${escapeText(frontMatter.sidebarLabel, { escape: "mdx" })}
---

import "@speakeasy-api/docs-md-react/docusaurus.css";
`;
  },

  postProcess() {
    const settings = getSettings();

    // Create the about page metadata
    writeFileSync(
      join(settings.output.pageOutDir, "_category_.json"),
      JSON.stringify(
        {
          position: 2,
          label: "API Reference",
          collapsible: true,
          collapsed: false,
        },
        null,
        "  "
      )
    );

    // Create the tag pages metadata
    writeFileSync(
      join(settings.output.pageOutDir, "tag", "_category_.json"),
      JSON.stringify(
        {
          position: 3,
          label: "Operations",
          collapsible: true,
          collapsed: false,
        },
        null,
        "  "
      )
    );
  },
};
