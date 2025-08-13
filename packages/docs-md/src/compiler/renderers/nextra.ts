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
  "global-security": { title: "Global Security", theme: { collapsed: false } },
  tag: { title: "Operations", theme: { collapsed: false } },${schemasEntry}
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
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
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
