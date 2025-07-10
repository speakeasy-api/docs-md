import { dirname, relative } from "node:path";

import type {
  RendererAppendCodeArgs,
  RendererAppendSectionStartArgs,
  RendererAppendSidebarLinkArgs,
  RendererAppendTryItNowArgs,
  RendererBeginExpandableSectionArgs,
  RendererBeginTabbedSectionArgs,
  RendererBeginTabContentsArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite, rendererLines } from "./markdown.ts";
import { getEmbedPath, getEmbedSymbol } from "./util.ts";

export abstract class MdxSite extends MarkdownSite {
  // There isn't any difference between MdxSite and MarkdownSite at the moment,
  // but we still want the named class for consistency
}

export abstract class MdxRenderer extends MarkdownRenderer {
  #imports = new Map<
    string,
    { defaultAlias: string | undefined; namedImports: Set<string> }
  >();
  #includeSidebar = false;
  #currentPagePath: string;
  #site: MdxSite;

  constructor({ currentPagePath }: { currentPagePath: string }, site: MdxSite) {
    super();
    this.#currentPagePath = currentPagePath;
    this.#site = site;
  }

  public override render() {
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
    const parentData = super.render();
    let data = "";
    if (imports) {
      data += imports + "\n\n";
    }
    if (this.#includeSidebar) {
      data += "\n\n<SideBar />\n";
    }
    data += parentData;
    return data;
  }

  public override createCode(...[text, options]: RendererAppendCodeArgs) {
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        return `<code>${this.escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      }
      const escapedText = this.escapeText(text, {
        escape: options?.escape ?? "html",
      }).replaceAll("`", "\\`");
      this.insertComponentImport("Code");
      return `<Code text={\`${escapedText}\`} />`;
    } else {
      return super.createCode(text, options);
    }
  }

  protected insertDefaultImport(importPath: string, symbol: string) {
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

  protected insertNamedImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
    }
    this.#imports.get(importPath)?.namedImports.add(symbol);
  }

  protected getRelativeImportPath(startPath: string, endPath: string) {
    let importPath = relative(dirname(startPath), endPath);
    // Check if this is an import to a file in the same directory, which
    // for some reason relative doesn't include the ./ in
    if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
      importPath = `./${importPath}`;
    }
    return importPath;
  }

  protected abstract insertComponentImport(symbol: string): void;

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

  public override appendTryItNow(
    ...[{ externalDependencies, defaultValue }]: RendererAppendTryItNowArgs
  ) {
    this.insertComponentImport("TryItNow");
    this[rendererLines].push(
      `<TryItNow
 externalDependencies={${JSON.stringify(externalDependencies)}}
 defaultValue={\`${defaultValue}\`}
/>`
    );
  }
}
