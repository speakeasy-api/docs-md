import { dirname, relative } from "node:path";

import type { TryItNowProps } from "../../../types/shared.ts";
import { InternalError } from "../../../util/internalError.ts";
import { HEADINGS } from "../../content/constants.ts";
import type {
  RendererAddExpandableBreakoutArgs,
  RendererAddExpandablePropertyArgs,
  RendererAddOperationArgs,
  RendererAppendSidebarLinkArgs,
  RendererAppendTryItNowArgs,
  RendererConstructorArgs,
  RendererCreateAppendCodeArgs,
  RendererCreatePillArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateTabbedSectionTabArgs,
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
  #codeThemes: TryItNowProps["themes"];
  #idStack: string[] = [];
  #expandableIdStack: string[] | undefined;

  constructor(
    args: RendererConstructorArgs,
    codeThemes?: TryItNowProps["themes"]
  ) {
    super(args);
    this.#currentPagePath = args.currentPagePath;
    this.#codeThemes = codeThemes;
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
      } else if (symbols.namedImports.size > 0) {
        imports += `import { ${Array.from(symbols.namedImports).join(", ")} } from "${importPath}";\n`;
      } else {
        imports += `import "${importPath}";\n`;
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

  public override createCode(...[text, options]: RendererCreateAppendCodeArgs) {
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

  protected insertPackageImport(importPath: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
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

  public override createPillStart(...[variant]: RendererCreatePillArgs) {
    this.insertComponentImport("Pill");
    return `<Pill variant="${variant}">`;
  }

  public override createPillEnd() {
    return "</Pill>";
  }

  public override addOperationSection(...args: RendererAddOperationArgs) {
    this.#idStack.push(args[0].operationId);
    super.addOperationSection(...args);
    this.#idStack.pop();
  }

  protected override handleCreateBreakouts(cb: () => void) {
    if (this.#expandableIdStack) {
      throw new InternalError(
        "handleCreateBreakouts called while inside an expandable section"
      );
    }
    this.#expandableIdStack = [...this.#idStack];
    this.insertComponentImport("ExpandableSection");
    this.appendText("<ExpandableSection>");
    cb();
    this.appendText("</ExpandableSection>");
    this.#expandableIdStack = undefined;
  }

  #getBreakoutIdInfo() {
    const stack = this.getContextStack().map((c) => c.id);
    const id = stack.join("_");
    const parentId = stack.slice(0, -1).join("_") || undefined;
    return { id, parentId };
  }

  public override addExpandableBreakout(
    ...[{ createTitle, createContent }]: RendererAddExpandableBreakoutArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableBreakout");
    this.appendText(
      `<ExpandableBreakout slot="entry" id="${id}"${parentId ? ` parentId="${parentId}"` : ""}>`
    );

    this.appendText(`<div slot="title">`);
    createTitle();
    this.appendText("</div>");

    if (createContent) {
      this.appendText(`<div slot="content">`);
      createContent();
      this.appendText("</div>");
    }

    this.appendText("</ExpandableBreakout>");
  }

  public override addExpandableProperty(
    ...[
      { typeInfo, annotations, title, createContent },
    ]: RendererAddExpandablePropertyArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableProperty");
    this.appendText(
      `<ExpandableProperty slot="entry" id="${id}"${parentId ? ` parentId="${parentId}"` : ""} typeInfo={${JSON.stringify(typeInfo)}} typeAnnotations={${JSON.stringify(
        annotations
      )}}>`,
      { escape: "none" }
    );

    this.appendText(`<div slot="title">`);
    this.appendHeading(HEADINGS.PROPERTY_HEADING_LEVEL, title, {
      escape: "mdx",
      id: this.getCurrentId(),
    });
    this.appendText("</div>");

    if (createContent) {
      this.appendText(`<div slot="content">`);
      createContent();
      this.appendText("</div>");
    }

    this.appendText(`</ExpandableProperty>`);
  }

  public override createSectionStart(
    ...[{ variant = "default" } = {}]: RendererCreateSectionArgs
  ) {
    this.insertComponentImport("Section");
    return `<Section variant="${variant}">`;
  }

  public override createSectionEnd() {
    return "</Section>";
  }

  public override createSectionTitleStart(
    ...[{ variant = "default" } = {}]: RendererCreateSectionTitleArgs
  ) {
    this.insertComponentImport("SectionTitle");
    return `<SectionTitle slot="title" variant="${variant}">`;
  }

  public override createSectionTitleEnd() {
    return `</SectionTitle>`;
  }

  public override createSectionContentStart(
    ...[{ variant = "default", id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.insertComponentImport("SectionContent");
    return `<SectionContent slot="content" variant="${variant}"${id ? ` id="${id}"` : ""}>`;
  }

  public override createSectionContentEnd() {
    return `</SectionContent>`;
  }

  protected override createTabbedSectionStart() {
    this.insertComponentImport("TabbedSection");
    return `<TabbedSection>`;
  }

  protected override createTabbedSectionEnd() {
    return "</TabbedSection>";
  }

  protected override createTabbedSectionTabStart(
    ...[id]: RendererCreateTabbedSectionTabArgs
  ) {
    this.insertComponentImport("SectionTab");
    return `<SectionTab slot="tab" id="${id}">`;
  }

  protected override createTabbedSectionTabEnd() {
    return "</SectionTab>";
  }

  public override createDebugPlaceholderStart() {
    this.insertComponentImport("DebugPlaceholder");
    return `<DebugPlaceholder>`;
  }

  public override createDebugPlaceholderEnd() {
    return "</DebugPlaceholder>";
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

    if (this.getSite().hasPage(embedPath)) {
      return;
    }
    return this.getSite().createPage(embedPath);
  }

  public override appendTryItNow(
    ...[{ externalDependencies, defaultValue }]: RendererAppendTryItNowArgs
  ) {
    this.insertComponentImport("TryItNow");
    this[rendererLines].push(
      `<TryItNow
 externalDependencies={${JSON.stringify(externalDependencies)}}
 defaultValue={\`${defaultValue}\`}
 ${this.#codeThemes ? `themes={${JSON.stringify(this.#codeThemes)}}` : ""}
/>`
    );
  }
}
