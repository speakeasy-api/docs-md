import { dirname, join, relative } from "node:path";

import type { Renderer } from "../../types/renderer.ts";
import type { Site } from "../../types/site.ts";
import { getSettings } from "../../util/settings.ts";
import {
  MarkdownRenderer,
  MarkdownSite,
  rendererLines,
} from "../markdown/renderer.ts";

function getEmbedPath(embedName: string) {
  return join(
    getSettings().output.componentOutDir,
    "embeds",
    embedName + ".mdx"
  );
}

function getEmbedSymbol(embedName: string) {
  return `Embed${embedName}`;
}

export class MdxSite extends MarkdownSite implements Site {
  public override createEmbedPage(embedName: string): Renderer | undefined {
    const embedPath = getEmbedPath(embedName);
    if (this.hasPage(embedPath)) {
      return;
    }
    return this.createPage(embedPath);
  }
}

export class MdxRenderer extends MarkdownRenderer implements Renderer {
  #currentPagePath: string;
  #imports = new Map<
    string,
    { defaultAlias: string | undefined; namedImports: Set<string> }
  >();
  #includeSidebar = false;

  constructor({ currentPagePath }: { currentPagePath: string }) {
    super();
    this.#currentPagePath = currentPagePath;
  }

  public override appendSidebarLink({
    title,
    embedName,
  }: {
    title: string;
    embedName: string;
  }) {
    // If this is a circular import, skip processing sidebar
    if (!this.#insertEmbedImport(embedName)) {
      // TODO: add debug logging
      return;
    }
    this.#includeSidebar = true;
    this.#insertThirdPartyImport("SideBarCta", "@speakeasy-api/docs-md");
    this.#insertThirdPartyImport("SideBar", "@speakeasy-api/docs-md");
    this[rendererLines].push(
      `<p>
  <SideBarCta cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
    <${getEmbedSymbol(embedName)} />
  </SideBarCta>
</p>`
    );
  }

  // TODO: need to type this properly, but we can't import types from assets
  // since they can't be built as part of this TS project
  public override appendTryItNow(
    props: {
      externalDependencies?: Record<string, string>;
      defaultValue?: string;
    } & Record<string, unknown>
  ) {
    this.#insertThirdPartyImport("TryItNow", "@speakeasy-api/docs-md");
    const escapedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => [
        key,
        typeof value === "string"
          ? this.escapeText(value, { escape: "mdx" })
          : JSON.stringify(value),
      ])
    );
    this[rendererLines].push(
      `<TryItNow {...${JSON.stringify(escapedProps)}} externalDependencies={${JSON.stringify(props.externalDependencies)}} defaultValue={\`${props.defaultValue}\`} />`
    );
  }

  public override finalize() {
    let imports = "";
    for (const [importPath, symbols] of this.#imports) {
      if (symbols.defaultAlias && symbols.namedImports.size > 0) {
        imports += `import ${symbols.defaultAlias}, { ${Array.from(
          symbols.namedImports
        ).join(", ")} } from "${importPath}";\n`;
      } else if (symbols.defaultAlias) {
        imports += `import ${symbols.defaultAlias} from "${importPath}";\n`;
      } else {
        imports += `import { ${Array.from(symbols.namedImports).join(", ")} } from "${importPath}";\n`;
      }
    }
    const parentData = super.finalize();
    const data =
      (imports ? imports + "\n\n" : "") +
      (this.#includeSidebar ? "<SideBar />\n\n" : "") +
      parentData;
    return data;
  }

  #insertDefaultImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
    }
    // Will never be undefined due to the above. I wish TypeScript could narrow
    // map/set .has() calls
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#imports.get(importPath)!.defaultAlias = symbol;
  }

  #insertNamedImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
    }
    this.#imports.get(importPath)?.namedImports.add(symbol);
  }

  #insertEmbedImport(embedName: string) {
    const embedPath = getEmbedPath(embedName);

    // TODO: handle this more gracefully. This happens when we have a direct
    // circular dependency, and the page needs to import itself
    if (this.#currentPagePath === embedPath) {
      return false;
    }

    let importPath = relative(dirname(this.#currentPagePath), embedPath);
    // Check if this is an import to a file in the same directory, which
    // for some reason relative doesn't include the ./ in
    if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
      importPath = `./${importPath}`;
    }
    this.#insertDefaultImport(importPath, getEmbedSymbol(embedName));

    return true;
  }

  #insertThirdPartyImport(symbol: string, importPath: string) {
    this.#insertNamedImport(importPath, symbol);
  }
}
