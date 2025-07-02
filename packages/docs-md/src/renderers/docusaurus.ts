import { join, resolve } from "node:path";

import { getSettings } from "../util/settings.ts";
import type {
  RendererAppendCodeArgs,
  RendererAppendSidebarLinkArgs,
  RendererAppendTryItNowArgs,
  RendererBeginExpandableSectionArgs,
  RendererInsertFrontMatterArgs,
  SiteBuildPagePathArgs,
  SiteGetRendererArgs,
} from "./base/base.ts";
import { rendererLines } from "./base/markdown.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";
import { getEmbedPath, getEmbedSymbol } from "./base/util.ts";

export class DocusaurusSite extends MdxSite {
  public override buildPagePath(
    ...[slug, { appendIndex = false } = {}]: SiteBuildPagePathArgs
  ): string {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
  }

  public override render() {
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
    return super.render();
  }

  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new DocusaurusRenderer(options, this);
  }
}

class DocusaurusRenderer extends MdxRenderer {
  #frontMatter: string | undefined;
  #includeSidebar = false;
  #currentPagePath: string;
  #site: DocusaurusSite;

  constructor(
    { currentPagePath }: { currentPagePath: string },
    site: DocusaurusSite
  ) {
    super();
    this.#currentPagePath = currentPagePath;
    this.#site = site;
  }

  public override insertFrontMatter(
    ...[{ sidebarPosition, sidebarLabel }]: RendererInsertFrontMatterArgs
  ) {
    this.#frontMatter = `---
sidebar_position: ${sidebarPosition}
sidebar_label: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }

  public override createCode(...[text, options]: RendererAppendCodeArgs) {
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        return `<code>${this.escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      }
      return `<pre style={{
  backgroundColor: "var(--ifm-code-background)",
  border: "0.1rem solid rgba(0, 0, 0, 0.1)",
  borderRadius: "var(--ifm-code-border-radius)",
  fontFamily: "var(--ifm-font-family-monospace)",
  fontSize: "var(--ifm-code-font-size)",
  verticalAlign: "middle",
}}>
<code>
<p style={{ margin: "0" }}>${this.escapeText(text, { escape: options?.escape ?? "html" })}</p>
</code>
</pre>`;
    } else {
      return super.createCode(text, options);
    }
  }

  public override appendCode(...args: RendererAppendCodeArgs) {
    this.appendText(this.createCode(...args), { escape: "none" });
  }

  public override createExpandableSectionStart(
    ...[
      title,
      id,
      { escape = "markdown" } = {},
    ]: RendererBeginExpandableSectionArgs
  ) {
    this.insertThirdPartyImport("ExpandableSection", "@speakeasy-api/docs-md");
    return `<ExpandableSection.Docusaurus title="${this.escapeText(title, { escape })}" id="${id}">`;
  }

  public override createExpandableSectionEnd() {
    return "</ExpandableSection.Docusaurus>";
  }

  public override appendSidebarLink(
    ...[{ title, embedName }]: RendererAppendSidebarLinkArgs
  ) {
    const embedPath = getEmbedPath(embedName);

    // TODO: handle this more gracefully. This happens when we have a direct
    // circular dependency, and the page needs to import itself, which can't be
    // done of course
    if (this.#currentPagePath === embedPath) {
      return;
    }

    const importPath = this.getRelativeImportPath(
      this.#currentPagePath,
      embedPath
    );
    this.insertDefaultImport(importPath, getEmbedSymbol(embedName));

    this.#includeSidebar = true;
    this.insertThirdPartyImport("SideBarTrigger", "@speakeasy-api/docs-md");
    this.insertThirdPartyImport("SideBar", "@speakeasy-api/docs-md");
    this[rendererLines].push(
      `<p>
    <SideBarTrigger.Docusaurus cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarTrigger.Docusaurus>
  </p>`
    );

    if (this.#site.hasPage(embedPath)) {
      return;
    }
    return this.#site.createPage(embedPath);
  }

  public override appendTryItNow(
    ...[{ externalDependencies, defaultValue }]: RendererAppendTryItNowArgs
  ) {
    this.insertThirdPartyImport("TryItNow", "@speakeasy-api/docs-md");
    this[rendererLines].push(
      `<TryItNow.Docusaurus
 externalDependencies={${JSON.stringify(externalDependencies)}}
 defaultValue={\`${defaultValue}\`}
/>`
    );
  }

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      parentData +
      (this.#includeSidebar ? "\n\n<SideBar.Docusaurus />\n" : "");
    return data;
  }
}
