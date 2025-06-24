import { join, resolve } from "node:path";

import type { Renderer } from "../types/renderer.ts";
import type { Site } from "../types/site.ts";
import { getSettings } from "../util/settings.ts";
import { rendererLines } from "./markdown.ts";
import { getEmbedSymbol, MdxRenderer, MdxSite } from "./mdx.ts";

export class DocusaurusSite extends MdxSite implements Site {
  public override buildPagePath(slug: string): string {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  }

  public override finalize() {
    const settings = getSettings();
    this.createPage(
      join(settings.output.pageOutDir, "_category_.json")
    ).appendText(
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
      { escape: "none" }
    );
    this.createPage(
      join(settings.output.pageOutDir, "tag", "_category_.json")
    ).appendText(
      JSON.stringify(
        {
          position: 3,
          label: "Operations",
          collapsible: true,
          collapsed: false,
        },
        null,
        "  "
      ),
      { escape: "none" }
    );
    if (settings.display.showSchemasInNav) {
      this.createPage(
        join(settings.output.pageOutDir, "schema", "_category_.json")
      ).appendText(
        JSON.stringify(
          {
            position: 4,
            label: "Schemas",
            collapsible: true,
            collapsed: true,
          },
          null,
          "  "
        ),
        { escape: "none" }
      );
    }
    return super.finalize();
  }
}

export class DocusaurusRenderer extends MdxRenderer implements Renderer {
  #frontMatter: string | undefined;
  #includeSidebar = false;

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

  public override appendCodeBlock(
    text: string,
    options?:
      | {
          variant: "default";
          language?: string;
        }
      | {
          variant: "raw";
          language?: never;
        }
  ) {
    if (options?.variant === "raw") {
      this.appendText(
        `<pre style={{
  backgroundColor: "var(--ifm-code-background)",
  border: "0.1rem solid rgba(0, 0, 0, 0.1)",
  borderRadius: "var(--ifm-code-border-radius)",
  fontFamily: "var(--ifm-font-family-monospace)",
  fontSize: "var(--ifm-code-font-size)",
  verticalAlign: "middle",
}}>
<code>
${this.escapeText(text, { escape: "html" })}
</code>
</pre>`,
        { escape: "none" }
      );
    } else {
      super.appendCodeBlock(text, options);
    }
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
    <SideBarCta.Docusaurus cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarCta.Docusaurus>
  </p>`
    );
  }

  public override finalize() {
    const parentData = super.finalize();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      parentData +
      (this.#includeSidebar ? "\n<SideBar.Docusaurus />\n" : "");
    return data;
  }
}
