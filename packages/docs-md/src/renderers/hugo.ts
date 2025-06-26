import { join, resolve } from "node:path";

import type { Renderer } from "../types/renderer.ts";
import type { Site } from "../types/site.ts";
import { getSettings } from "../util/settings.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";

export class HugoSite extends MarkdownSite implements Site {
  public override buildPagePath(
    slug: string,
    { appendIndex = false }: { appendIndex?: boolean } = {}
  ): string {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/_index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}.md`));
  }

  protected override getRenderer(): Renderer {
    return new HugoRenderer();
  }
}

class HugoRenderer extends MarkdownRenderer implements Renderer {
  #frontMatter: string | undefined;

  public override insertFrontMatter({
    sidebarPosition,
    sidebarLabel,
  }: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
title: ${this.escapeText(sidebarLabel, { escape: "none" })}
weight: ${sidebarPosition}
---`;
  }

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
  }
}
