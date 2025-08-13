import { dirname, relative } from "node:path";

import { InternalError } from "../../../util/internalError.ts";
import { HEADINGS } from "../../content/constants.ts";
import type {
  RendererConstructorArgs,
  RendererCreateCodeArgs,
  RendererCreateDebugPlaceholderArgs,
  RendererCreateExpandableBreakoutArgs,
  RendererCreateExpandablePropertyArgs,
  RendererCreateFrontMatterDisplayTypeArgs,
  RendererCreateOperationArgs,
  RendererCreatePillArgs,
  RendererCreatePopoutArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateTabbedSectionTabArgs,
  RendererCreateTryItNowSectionArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";
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
  #idStack: string[] = [];
  #expandableIdStack: string[] | undefined;

  constructor(args: RendererConstructorArgs) {
    super(args);
    this.#currentPagePath = args.currentPagePath;
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

  public override createCode(...[text, options]: RendererCreateCodeArgs) {
    let line: string;
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        line = `<code>${this.escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      } else {
        const escapedText = this.escapeText(text, {
          escape: options?.escape ?? "html",
        }).replaceAll("`", "\\`");
        this.insertComponentImport("Code");
        line = `<Code text={\`${escapedText}\`} />`;
      }
    } else {
      line = super.createCode(
        text,
        options ? { ...options, append: false } : undefined
      );
    }
    if (options?.append ?? true) {
      this.appendLine(line);
    }
    return line;
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

  public override createPill(
    ...[variant, cb, { append = false } = {}]: RendererCreatePillArgs
  ) {
    this.insertComponentImport("Pill");
    const pill = `<Pill variant="${variant}">${cb()}</Pill>`;
    if (append) {
      this.appendLine(pill);
    }
    return pill;
  }

  public override createOperationSection(...args: RendererCreateOperationArgs) {
    this.#idStack.push(args[0].operationId);
    super.createOperationSection(...args);
    this.#idStack.pop();
  }

  protected override handleCreateSecurity(cb: () => void) {
    if (this.#expandableIdStack) {
      throw new InternalError(
        "handleCreateBreakouts called while inside an expandable section"
      );
    }
    this.#expandableIdStack = [...this.#idStack];
    this.insertComponentImport("ExpandableSection");
    this.createText("<ExpandableSection>");
    cb();
    this.createText("</ExpandableSection>");
    this.#expandableIdStack = undefined;
  }

  protected override handleCreateParameters(cb: () => void) {
    if (this.#expandableIdStack) {
      throw new InternalError(
        "handleCreateParameters called while inside an expandable section"
      );
    }
    this.#expandableIdStack = [...this.#idStack];
    this.insertComponentImport("ExpandableSection");
    this.createText("<ExpandableSection>");
    cb();
    this.createText("</ExpandableSection>");
    this.#expandableIdStack = undefined;
  }

  protected override handleCreateBreakouts(cb: () => void) {
    if (this.#expandableIdStack) {
      throw new InternalError(
        "handleCreateBreakouts called while inside an expandable section"
      );
    }
    this.#expandableIdStack = [...this.#idStack];
    this.insertComponentImport("ExpandableSection");
    this.createText("<ExpandableSection>");
    cb();
    this.createText("</ExpandableSection>");
    this.#expandableIdStack = undefined;
  }

  #getBreakoutIdInfo() {
    const stack = this.getContextStack()
      .filter((c) => c.type === "schema")
      .map((c) => c.id);
    const id = stack.join("_");
    const parentId = stack.slice(0, -1).join("_") || undefined;
    return { id, parentId };
  }

  public override createExpandableBreakout(
    ...[
      { createTitle, createContent, expandByDefault },
    ]: RendererCreateExpandableBreakoutArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableBreakout");
    this.createText(
      `<ExpandableBreakout
  slot="entry"
  id="${id}"
  headingId="${this.getCurrentId()}"${parentId ? ` parentId="${parentId}"` : ""}
  hasFrontMatter={${createContent ? "true" : "false"}}
  expandByDefault={${expandByDefault}}
>`,
      { escape: "none" }
    );

    this.createText(`<div slot="title">`);
    createTitle();
    this.createText("</div>");

    if (createContent) {
      this.createText(`<div slot="content">`);
      createContent();
      this.createText("</div>");
    }

    this.createText("</ExpandableBreakout>");
  }

  public override createExpandableProperty(
    ...[
      { typeInfo, annotations, title, createContent, expandByDefault },
    ]: RendererCreateExpandablePropertyArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableProperty");
    this.createText(
      `<ExpandableProperty
  slot="entry"
  id="${id}"
  headingId="${this.getCurrentId()}"${
    parentId
      ? `
  parentId="${parentId}"`
      : ""
  }${
    typeInfo
      ? `
  typeInfo={${JSON.stringify(typeInfo)}}`
      : ""
  }${
    annotations.length > 0
      ? `
  typeAnnotations={${JSON.stringify(annotations)}}`
      : ""
  }
  hasFrontMatter={${createContent ? "true" : "false"}}
  expandByDefault={${expandByDefault}}
>`,
      { escape: "none" }
    );

    this.createText(`<div slot="title">`);
    this.createHeading(HEADINGS.PROPERTY_HEADING_LEVEL, title, {
      escape: "mdx",
      id: this.getCurrentId(),
    });
    this.createText("</div>");

    if (createContent) {
      this.createText(`<div slot="content">`);
      createContent();
      this.createText("</div>");
    }

    this.createText(`</ExpandableProperty>`);
  }

  public override createFrontMatterDisplayType(
    ...[{ typeInfo }]: RendererCreateFrontMatterDisplayTypeArgs
  ) {
    this.insertComponentImport("FrontMatterDisplayType");
    this.createText(
      `<FrontMatterDisplayType typeInfo={${JSON.stringify(typeInfo)}} />`,
      { escape: "none" }
    );
  }

  public override createSection(
    ...[cb, { variant = "default" } = {}]: RendererCreateSectionArgs
  ) {
    this.insertComponentImport("Section");
    this.createText(`<Section variant="${variant}">`);
    cb();
    this.createText("</Section>");
  }

  public override createSectionTitle(
    ...[cb, { variant = "default" } = {}]: RendererCreateSectionTitleArgs
  ) {
    this.insertComponentImport("SectionTitle");
    this.createText(`<SectionTitle slot="title" variant="${variant}">`);
    cb();
    this.createText("</SectionTitle>");
  }

  public override createSectionContent(
    ...[cb, { variant = "default", id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.insertComponentImport("SectionContent");
    this.createText(
      `<SectionContent slot="content" variant="${variant}"${id ? ` id="${id}"` : ""}>`
    );
    cb();
    this.createText("</SectionContent>");
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

  public override createDebugPlaceholder(
    ...[cb]: RendererCreateDebugPlaceholderArgs
  ) {
    this.insertComponentImport("DebugPlaceholder");
    this.appendLine(`<DebugPlaceholder>${cb()}</DebugPlaceholder>`);
  }

  public override createPopout(
    ...[{ title, embedName }, cb]: RendererCreatePopoutArgs
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
    this.appendLine(
      `<p>
    <SideBarTrigger cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarTrigger>
  </p>`
    );

    if (this.getSite().hasPage(embedPath)) {
      return;
    }
    const renderer = this.getSite().createPage(embedPath);
    cb(renderer);
  }

  public override createTryItNowSection(
    ...[
      { externalDependencies, defaultValue },
    ]: RendererCreateTryItNowSectionArgs
  ) {
    this.insertComponentImport("TryItNow");
    this.createTopLevelSection(
      {
        title: "Try it Now",
      },
      () =>
        this.appendLine(
          `<TryItNow
  externalDependencies={${JSON.stringify(externalDependencies)}}
  defaultValue={\`${defaultValue}\`}
/>`
        )
    );
  }
}
