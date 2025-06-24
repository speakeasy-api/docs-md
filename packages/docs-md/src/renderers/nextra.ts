import { join, resolve } from "node:path";

import type { Renderer } from "../types/renderer.ts";
import type { Site } from "../types/site.ts";
import { getSettings } from "../util/settings.ts";
import { rendererLines } from "./markdown.ts";
import { getEmbedSymbol, MdxRenderer, MdxSite } from "./mdx.ts";

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
    this.createPage(join(settings.output.pageOutDir, "_meta.ts")).appendText(
      config,
      { escape: "none" }
    );
    return super.finalize();
  }
}

export class NextraRenderer extends MdxRenderer implements Renderer {
  #frontMatter: string | undefined;
  #includeSidebar = false;

  public override insertFrontMatter({
    sidebarLabel,
  }: {
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }

  public override appendSidebarLink({
    title,
    embedName,
  }: {
    title: string;
    embedName: string;
  }) {
    // If this is a circular import, skip processing sidebar
    if (!this.insertEmbedImport(embedName)) {
      // TODO: add debug logging
      return;
    }
    this.#includeSidebar = true;
    this.insertThirdPartyImport("SideBarCta", "@speakeasy-api/docs-md");
    this.insertThirdPartyImport("SideBar", "@speakeasy-api/docs-md");
    this[rendererLines].push(
      `<p>
      <SideBarCta.Nextra cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
        <${getEmbedSymbol(embedName)} />
      </SideBarCta.Nextra>
    </p>`
    );
  }

  public override finalize() {
    const parentData = super.finalize();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      parentData +
      (this.#includeSidebar ? "\n<SideBar.Nextra />\n" : "");
    return data;
  }
}
