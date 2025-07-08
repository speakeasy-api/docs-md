import { join, resolve } from "node:path";

import { getSettings } from "../util/settings.ts";
import type {
  RendererAppendCodeArgs,
  RendererAppendHeadingArgs,
  RendererAppendSectionStartArgs,
  RendererAppendSidebarLinkArgs,
  RendererBeginExpandableSectionArgs,
  RendererBeginTabbedSectionArgs,
  RendererBeginTabContentsArgs,
  RendererInsertFrontMatterArgs,
  SiteBuildPagePathArgs,
  SiteGetRendererArgs,
} from "./base/base.ts";
import { rendererLines } from "./base/markdown.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";
import { getEmbedPath, getEmbedSymbol } from "./base/util.ts";

export class NextraSite extends MdxSite {
  public override buildPagePath(
    ...[slug, { appendIndex = false } = {}]: SiteBuildPagePathArgs
  ): string {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  public override render() {
    const settings = getSettings();
    const schemasEntry = settings.display.showSchemasInNav
      ? `\n  schemas: { title: "Schemas", theme: { collapsed: false } },`
      : "";
    const config = `export default {
  index: { title: "About", theme: { collapsed: false } },
  tag: { title: "Operations", theme: { collapsed: false } },${schemasEntry}
}`;
    this.createPage(join(settings.output.pageOutDir, "_meta.ts")).appendText(
      config,
      { escape: "none" }
    );
    return super.render();
  }

  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new NextraRenderer(options, this);
  }
}

class NextraRenderer extends MdxRenderer {
  #frontMatter: string | undefined;
  #includeSidebar = false;
  #currentPagePath: string;
  #site: NextraSite;

  constructor(
    { currentPagePath }: { currentPagePath: string },
    site: NextraSite
  ) {
    super();
    this.#currentPagePath = currentPagePath;
    this.#site = site;
  }

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      parentData +
      (this.#includeSidebar ? "\n\n<SideBar />\n" : "");
    return data;
  }

  private insertComponentImport(symbol: string) {
    this.insertNamedImport("@speakeasy-api/docs-md/nextra", symbol);
  }

  public override insertFrontMatter(
    ...[{ sidebarLabel }]: RendererInsertFrontMatterArgs
  ) {
    this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }

  public override createHeading(
    ...[
      level,
      text,
      { escape = "markdown", id } = {},
    ]: RendererAppendHeadingArgs
  ) {
    let line = `${`#`.repeat(level)} ${this.escapeText(text, { escape })}`;
    if (id) {
      // Oddly enough, Nextra uses a different syntax for heading IDs
      line += ` [#${id}]`;
    }
    return line;
  }

  public override createCode(...[text, options]: RendererAppendCodeArgs) {
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        return `<code className="nextra-code">${this.escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      }
      return `<pre className="x:group x:focus-visible:nextra-focus x:overflow-x-auto x:subpixel-antialiased x:text-[.9em] x:bg-white x:dark:bg-black x:py-4 x:ring-1 x:ring-inset x:ring-gray-300 x:dark:ring-neutral-700 x:contrast-more:ring-gray-900 x:contrast-more:dark:ring-gray-50 x:contrast-more:contrast-150 x:rounded-md not-prose">
<code className="nextra-code">
${this.escapeText(text, { escape: options?.escape ?? "html" })
  .split("\n")
  // Nextra does this weird thing where it wraps each line in _two_ spans with
  // it's code blocks, so we mimic that behavior here
  .map((line) => `<span><span>${line}</span></span>`)
  .join("\n")}
</code>
</pre>`;
    } else {
      return super.createCode(text, options);
    }
  }

  public override createSectionStart(
    ...[title, { id, escape = "mdx" }]: RendererAppendSectionStartArgs
  ) {
    this.insertComponentImport("Section");
    return `<Section title="${this.escapeText(title, { escape })}" id="${id}">`;
  }

  public override createSectionEnd() {
    return "</Section>";
  }

  public override createExpandableSectionStart(
    ...[title, { id, escape = "mdx" }]: RendererBeginExpandableSectionArgs
  ) {
    this.insertComponentImport("ExpandableSection");
    return `<ExpandableSection title="${this.escapeText(title, { escape })}" id="${id}">`;
  }

  public override createExpandableSectionEnd() {
    return "</ExpandableSection>";
  }
  public override createTabbedSectionStart(
    ...[
      title,
      { escape = "mdx", id, baseHeadingLevel = 3 },
    ]: RendererBeginTabbedSectionArgs
  ) {
    this.insertComponentImport("TabbedSection");
    return `<TabbedSection title="${this.escapeText(title, { escape })}" id="${id}" baseHeadingLevel="${baseHeadingLevel}">`;
  }

  public override createTabbedSectionEnd() {
    return "</TabbedSection>";
  }

  public override createTabContentsStart(
    ...[title, tooltip]: RendererBeginTabContentsArgs
  ) {
    return `<div title="${title}" tooltip="${tooltip}">`;
  }

  public override createTabContentsEnd() {
    return "</div>";
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
    this.insertComponentImport("SideBarTrigger");
    this.insertComponentImport("SideBar");
    this[rendererLines].push(
      `<p>
    <SideBarTrigger cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarTrigger>
  </p>`
    );

    if (this.#site.hasPage(embedPath)) {
      return;
    }
    return this.#site.createPage(embedPath);
  }

  public override appendTryItNow({
    externalDependencies,
    defaultValue,
  }: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }) {
    this.insertComponentImport("TryItNow");
    this[rendererLines].push(
      `<TryItNow
   externalDependencies={${JSON.stringify(externalDependencies)}}
   defaultValue={\`${defaultValue}\`}
  />`
    );
  }
}
