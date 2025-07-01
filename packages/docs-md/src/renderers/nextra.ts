import { join, resolve } from "node:path";

import type { Renderer } from "../types/renderer.ts";
import type { Site } from "../types/site.ts";
import { getSettings } from "../util/settings.ts";
import { rendererLines } from "./base/markdown.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";
import { getEmbedPath, getEmbedSymbol } from "./base/util.ts";

export class NextraSite extends MdxSite implements Site {
  public override buildPagePath(
    slug: string,
    { appendIndex = false }: { appendIndex?: boolean } = {}
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

  protected override getRenderer(options: {
    currentPagePath: string;
  }): Renderer {
    return new NextraRenderer(options, this);
  }
}

class NextraRenderer extends MdxRenderer implements Renderer {
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

  public override insertFrontMatter({
    sidebarLabel,
  }: {
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
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
        `<pre className="x:group x:focus-visible:nextra-focus x:overflow-x-auto x:subpixel-antialiased x:text-[.9em] x:bg-white x:dark:bg-black x:py-4 x:ring-1 x:ring-inset x:ring-gray-300 x:dark:ring-neutral-700 x:contrast-more:ring-gray-900 x:contrast-more:dark:ring-gray-50 x:contrast-more:contrast-150 x:rounded-md not-prose">
<code className="nextra-code">
${this.escapeText(text, { escape: "html" })
  .split("\n")
  // Nextra does this weird thing where it wraps each line in _two_ spans with
  // it's code blocks, so we mimic that behavior here
  .map((line) => `<span><span>${line}</span></span>`)
  .join("\n")}
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
    <SideBarTrigger.Nextra cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarTrigger.Nextra>
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
    this.insertThirdPartyImport("TryItNow", "@speakeasy-api/docs-md");
    this[rendererLines].push(
      `<TryItNow.Nextra
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
      (this.#includeSidebar ? "\n\n<SideBar.Nextra />\n" : "");
    return data;
  }
}
