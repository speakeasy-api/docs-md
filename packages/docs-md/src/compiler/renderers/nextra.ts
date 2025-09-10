import { join, resolve } from "node:path";

import { getSettings } from "../settings.ts";
import type {
  RendererConstructorArgs,
  RendererCreateHeadingArgs,
  SiteBuildPagePathArgs,
  SiteGetRendererArgs,
} from "./base/base.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";
export class NextraSite extends MdxSite {
  public override buildPagePath(...[slug]: SiteBuildPagePathArgs): string {
    const settings = getSettings();
    // Do nothing with `appendIndex`, since our appending of `/page.mdx`
    // implicitly handles the index case.
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  public override render() {
    const settings = getSettings();
    const config = `export default {
  index: { title: "About", theme: { collapsed: false } },
  endpoint: { title: "Operations", theme: { collapsed: false } }
}`;
    this.createPage(join(settings.output.pageOutDir, "_meta.ts")).createText(
      config,
      { escape: "none" }
    );
    return super.render();
  }

  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new NextraRenderer({ ...options });
  }
}

class NextraRenderer extends MdxRenderer {
  #frontMatter: string | undefined;

  constructor(args: RendererConstructorArgs) {
    super(args);
    if (args.frontMatter) {
      this.insertPackageImport("@speakeasy-api/docs-md/nextra.css");
      this.#frontMatter = `---
sidebarTitle: ${this.escapeText(args.frontMatter.sidebarLabel, { escape: "mdx" })}
---`;
    }
  }

  public override render() {
    const { contents, metadata } = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + contents;
    return { contents: data, metadata };
  }

  protected override insertComponentImport(symbol: string) {
    this.insertNamedImport("@speakeasy-api/docs-md/react", symbol);
  }

  public override createHeading(
    ...[
      level,
      text,
      { escape = "markdown", id, append = true } = {},
    ]: RendererCreateHeadingArgs
  ) {
    let line = `${`#`.repeat(level)} ${this.escapeText(text, { escape })}`;
    if (id) {
      // Oddly enough, Nextra uses a different syntax for heading IDs
      line += ` [#${id}]`;
    }
    if (append) {
      this.appendLine(line);
    }
    return line;
  }

  protected override getIdSeparator() {
    return "_";
  }
}
