import { join, resolve } from "node:path";

import type { Renderer } from "../../types/renderer.ts";
import type { Site } from "../../types/site.ts";
import { getSettings } from "../../util/settings.ts";
import { MdxRenderer, MdxSite } from "../mdx/renderer.ts";

export class DocusaurusSite extends MdxSite implements Site {
  public override buildPagePath(slug: string): string {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  }

  public override finalize() {
    const settings = getSettings();
    this.createRawPage(
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
    this.createRawPage(
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
    if (settings.display.showSchemasInNav) {
      this.createRawPage(
        join(settings.output.pageOutDir, "schema", "_category_.json"),
        JSON.stringify(
          {
            position: 4,
            label: "Schemas",
            collapsible: true,
            collapsed: true,
          },
          null,
          "  "
        )
      );
    }
    return super.finalize();
  }
}

export class DocusaurusRenderer extends MdxRenderer implements Renderer {
  #frontMatter: string | undefined;

  public override insertFrontMatter({
    sidebarPosition,
    sidebarLabel,
  }: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
sidebar_position: ${sidebarPosition}
sidebar_label: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }

  public override finalize() {
    const parentData = super.finalize();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
  }
}
