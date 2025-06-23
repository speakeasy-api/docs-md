import { join, resolve } from "node:path";

import type { Renderer } from "../../types/renderer.ts";
import type { Site } from "../../types/site.ts";
import { getSettings } from "../../util/settings.ts";
import { MdxRenderer, MdxSite } from "../mdx/renderer.ts";

export class NextraSite extends MdxSite implements Site {
  public override buildPagePath(slug: string): string {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  public override finalize() {
    const settings = getSettings();
    const schemasEntry = settings.display.showSchemasInNav
      ? `\n  schemas: { title: "Schemas", theme: { collapsed: false } },`
      : "";
    const config = `export default {
      about: { title: "About", theme: { collapsed: false } },
      tag: { title: "Operations", theme: { collapsed: false } },${schemasEntry}
    }`;
    this.createRawPage(join(settings.output.pageOutDir, "_meta.ts"), config);
    return super.finalize();
  }
}

export class NextraRenderer extends MdxRenderer implements Renderer {
  #frontMatter: string | undefined;

  public override insertFrontMatter({
    sidebarLabel,
  }: {
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }

  public override finalize() {
    const parentData = super.finalize();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
  }
}
