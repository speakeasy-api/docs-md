import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { escapeText } from "../../renderers/util.ts";
import { getSettings } from "../../settings.ts";
import type { FrameworkConfig } from "../../types/FrameworkConfig.ts";
import { InternalError } from "../../util/internalError.ts";

export const docusaurusConfig: FrameworkConfig = {
  rendererType: "mdx",
  componentPackageName: "@speakeasy-api/docs-md-react",

  buildPagePath(slug, { appendIndex = false } = {}) {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  },

  buildEmbedPath(slug) {
    const settings = getSettings();
    if (!settings.output.embedOutDir) {
      throw new InternalError("Embed output directory not set");
    }
    return resolve(join(settings.output.embedOutDir, `${slug}.mdx`));
  },

  buildPagePreamble(frontMatter, { isEmbed }) {
    if (frontMatter) {
      return `---
sidebar_position: ${frontMatter.sidebarPosition}
sidebar_label: ${escapeText(frontMatter.sidebarLabel, { escape: "mdx" })}
---

import "@speakeasy-api/docs-md-react/docusaurus.css";
`;
    } else if (isEmbed) {
      // Embeds in Docusaurus have a nasty bug where table of contents is
      // undefined and causes a crash. We just export an empty array to
      // work around it.
      return `---
hide_table_of_contents: true
---`;
    } else {
      return "";
    }
  },

  postProcess() {
    const settings = getSettings();

    // Create the about page metadata
    mkdirSync(settings.output.pageOutDir, { recursive: true });
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
      ),
      {}
    );

    // Create the endpoint pages metadata
    mkdirSync(join(settings.output.pageOutDir, "endpoint"), {
      recursive: true,
    });
    writeFileSync(
      join(settings.output.pageOutDir, "endpoint", "_category_.json"),
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
