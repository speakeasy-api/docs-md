import { join, resolve } from "node:path";

import { getSettings } from "../util/settings.ts";
import type {
  RendererInsertFrontMatterArgs,
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

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") + parentData;
    return data;
  }

  protected override insertComponentImport(symbol: string) {
    this.insertNamedImport("@speakeasy-api/docs-md/docusaurus", symbol);
  }

  public override insertFrontMatter(
    ...[{ sidebarPosition, sidebarLabel }]: RendererInsertFrontMatterArgs
  ) {
    this.#frontMatter = `---
sidebar_position: ${sidebarPosition}
sidebar_label: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
  }
}
