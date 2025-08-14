import { join, resolve } from "node:path";

import { getSettings } from "../settings.ts";
import type {
  RendererConstructorArgs,
  SiteBuildPagePathArgs,
  SiteGetRendererArgs,
} from "./base/base.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";

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
    ).createText(
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
    ).createText(
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
      ).createText(
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
    return new DocusaurusRenderer(options);
  }
}

class DocusaurusRenderer extends MdxRenderer {
  #frontMatter: string | undefined;

  constructor(args: RendererConstructorArgs) {
    super(args);
    if (args.frontMatter) {
      this.insertPackageImport("@speakeasy-api/docs-md/docusaurus.css");
      this.#frontMatter = `---
sidebar_position: ${args.frontMatter.sidebarPosition}
sidebar_label: ${this.escapeText(args.frontMatter.sidebarLabel, { escape: "mdx" })}
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
}
