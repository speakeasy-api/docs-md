import { dirname, relative } from "node:path";

import { HEADINGS } from "../../content/constants.ts";
import { getSettings } from "../../settings.ts";
import type {
  RendererConstructorArgs,
  RendererCreateCodeArgs,
  RendererCreateCodeSamplesSectionArgs,
  RendererCreateDebugPlaceholderArgs,
  RendererCreateExpandableBreakoutArgs,
  RendererCreateExpandablePropertyArgs,
  RendererCreateFrontMatterDisplayTypeArgs,
  RendererCreateOperationArgs,
  RendererCreateParametersSectionArgs,
  RendererCreatePillArgs,
  RendererCreatePopoutArgs,
  RendererCreateRequestSectionArgs,
  RendererCreateResponsesArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateSecuritySectionArgs,
  RendererCreateTabbedSectionArgs,
  RendererCreateTabbedSectionTabArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";
import {
  getEmbedPath,
  getEmbedSymbol,
  getPrettyCodeSampleLanguage,
} from "./util.ts";

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
    const { contents, metadata } = super.render();
    let data = "";
    if (imports) {
      data += imports + "\n\n";
    }
    if (this.#includeSidebar) {
      data += "\n\n<SideBar />\n";
    }
    return { contents: data + contents, metadata };
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
    this.insertComponentImport("Operation");
    this.appendLine(`<Operation>`);
    super.createOperationSection(...args);
    this.appendLine(`</Operation>`);
  }

  protected override handleCreateOperationFrontmatter(cb: () => void) {
    this.insertComponentImport("OperationFrontMatterSection");
    this.appendLine(`<OperationFrontMatterSection slot="front-matter">`);
    cb();
    this.appendLine(`</OperationFrontMatterSection>`);
  }

  public override createCodeSamplesSection(
    ...[cb]: RendererCreateCodeSamplesSectionArgs
  ) {
    this.enterContext({ id: "code-samples", type: "section" });
    this.insertComponentImport("OperationCodeSamplesSection");
    this.appendLine(`<OperationCodeSamplesSection slot="code-samples">`);
    this.createTabbedSection(() => {
      this.createSectionTitle(
        () =>
          this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, "Code Samples", {
            id: this.getCurrentId(),
          }),
        { variant: "default" }
      );
      cb({
        createTryItNowEntry: ({
          externalDependencies,
          defaultValue,
          language,
        }) => {
          this.enterContext({ id: language, type: "section" });
          this.insertComponentImport("TryItNow");
          this.createTabbedSectionTab(
            () => this.createText(getPrettyCodeSampleLanguage(language)),
            { id: this.getCurrentId() }
          );
          this.createSectionContent(
            () => {
              this.appendLine(
                `<TryItNow
  externalDependencies={${JSON.stringify(externalDependencies)}}
  defaultValue={\`${defaultValue}\`}
/>`
              );
            },
            {
              id: this.getCurrentId(),
              variant: "top-level",
            }
          );
          this.exitContext();
        },
        createCodeSampleEntry: ({ language, value }) => {
          this.enterContext({ id: language, type: "section" });
          this.createTabbedSectionTab(
            () => this.createText(getPrettyCodeSampleLanguage(language)),
            { id: this.getCurrentId() }
          );
          this.createSectionContent(
            () => {
              this.insertComponentImport("CodeSample");
              this.appendLine("<CodeSample>");
              this.createCode(value, {
                language,
                variant: "default",
                style: "block",
              });
              this.appendLine("</CodeSample>");
            },
            {
              id: this.getCurrentId(),
              variant: "top-level",
            }
          );
          this.exitContext();
        },
      });
    });
    this.appendLine(`</OperationCodeSamplesSection>`);
    this.exitContext();
  }

  public override createSecuritySection(
    ...args: RendererCreateSecuritySectionArgs
  ) {
    this.insertComponentImport("OperationSecuritySection");
    this.appendLine('<OperationSecuritySection slot="security">');
    super.createSecuritySection(...args);
    this.appendLine("</OperationSecuritySection>");
  }

  public override createParametersSection(
    ...args: RendererCreateParametersSectionArgs
  ) {
    this.insertComponentImport("OperationParametersSection");
    this.appendLine('<OperationParametersSection slot="parameters">');
    super.createParametersSection(...args);
    this.appendLine("</OperationParametersSection>");
  }

  public override createRequestSection(
    ...args: RendererCreateRequestSectionArgs
  ) {
    this.insertComponentImport("OperationRequestBodySection");
    this.appendLine('<OperationRequestBodySection slot="request-body">');
    super.createRequestSection(...args);
    this.appendLine("</OperationRequestBodySection>");
  }

  public override createResponsesSection(...args: RendererCreateResponsesArgs) {
    this.insertComponentImport("OperationResponseBodySection");
    this.appendLine('<OperationResponseBodySection slot="response-body">');
    super.createResponsesSection(...args);
    this.appendLine("</OperationResponseBodySection>");
  }

  protected override handleCreateSecurity(cb: () => void) {
    this.insertComponentImport("ExpandableSection");
    this.appendLine("<ExpandableSection>");
    cb();
    this.appendLine("</ExpandableSection>");
  }

  protected override handleCreateParameters(cb: () => void) {
    this.insertComponentImport("ExpandableSection");
    this.appendLine("<ExpandableSection>");
    cb();
    this.appendLine("</ExpandableSection>");
  }

  protected override handleCreateBreakouts(cb: () => void) {
    this.insertComponentImport("ExpandableSection");
    this.appendLine("<ExpandableSection>");
    cb();
    this.appendLine("</ExpandableSection>");
  }

  #getBreakoutIdInfo() {
    const stack = this.getContextStack()
      .filter((c) => c.type === "schema")
      .map((c) => c.id);
    const id = stack.join("_");
    const parentId = stack.slice(0, -1).join("_") || undefined;
    return { id, parentId };
  }

  protected override handleCreateExpandableBreakout(
    ...[
      { createTitle, createContent, isTopLevel },
    ]: RendererCreateExpandableBreakoutArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableBreakout");
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;
    this.appendLine(
      `<ExpandableBreakout
  slot="entry"
  id="${id}"
  headingId="${this.getCurrentId()}"${parentId ? ` parentId="${parentId}"` : ""}
  hasFrontMatter={${createContent ? "true" : "false"}}
  expandByDefault={${expandByDefault}}
>`
    );

    this.appendLine(`<div slot="title">`);
    createTitle();
    this.appendLine("</div>");

    if (createContent) {
      this.appendLine(`<div slot="content">`);
      createContent();
      this.appendLine("</div>");
    }

    this.appendLine("</ExpandableBreakout>");
  }

  protected override handleCreateExpandableProperty(
    ...[
      { typeInfo, annotations, title, isTopLevel, createContent },
    ]: RendererCreateExpandablePropertyArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    this.insertComponentImport("ExpandableProperty");
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;
    this.appendLine(
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
>`
    );

    this.appendLine(`<div slot="title">`);
    this.createHeading(HEADINGS.PROPERTY_HEADING_LEVEL, title, {
      escape: "mdx",
      id: this.getCurrentId(),
    });
    this.appendLine("</div>");

    if (createContent) {
      this.appendLine(`<div slot="content">`);
      createContent();
      this.appendLine("</div>");
    }

    this.appendLine("</ExpandableProperty>");
  }

  public override createFrontMatterDisplayType(
    ...[{ typeInfo }]: RendererCreateFrontMatterDisplayTypeArgs
  ) {
    this.insertComponentImport("FrontMatterDisplayType");
    this.appendLine(
      `<FrontMatterDisplayType typeInfo={${JSON.stringify(typeInfo)}} />`
    );
  }

  public override createSection(
    ...[cb, { variant = "default" } = {}]: RendererCreateSectionArgs
  ) {
    this.insertComponentImport("Section");
    this.appendLine(`<Section variant="${variant}">`);
    cb();
    this.appendLine("</Section>");
  }

  public override createSectionTitle(
    ...[cb, { variant = "default" } = {}]: RendererCreateSectionTitleArgs
  ) {
    this.insertComponentImport("SectionTitle");
    this.appendLine(`<SectionTitle slot="title" variant="${variant}">`);
    cb();
    this.appendLine("</SectionTitle>");
  }

  public override createSectionContent(
    ...[cb, { variant = "default", id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.insertComponentImport("SectionContent");
    this.appendLine(
      `<SectionContent slot="content" variant="${variant}"${id ? ` id="${id}"` : ""}>`
    );
    cb();
    this.appendLine("</SectionContent>");
  }

  protected override createTabbedSection(
    ...[cb]: RendererCreateTabbedSectionArgs
  ) {
    this.insertComponentImport("TabbedSection");
    this.appendLine("<TabbedSection>");
    cb();
    this.appendLine("</TabbedSection>");
  }

  protected override createTabbedSectionTab(
    ...[cb, { id }]: RendererCreateTabbedSectionTabArgs
  ) {
    this.insertComponentImport("SectionTab");
    this.appendLine(`<SectionTab slot="tab" id="${id}">`);
    cb();
    this.appendLine("</SectionTab>");
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
}
