import { dirname, relative } from "node:path";

import { HEADINGS } from "../../content/constants.ts";
import { getSettings } from "../../settings.ts";
import type {
  RendererCreateCodeArgs,
  RendererCreateCodeSamplesSectionArgs,
  RendererCreateDebugPlaceholderArgs,
  RendererCreateExpandableBreakoutArgs,
  RendererCreateExpandablePropertyArgs,
  RendererCreateFrontMatterDisplayTypeArgs,
  RendererCreateOperationArgs,
  RendererCreateParametersSectionArgs,
  RendererCreatePillArgs,
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
import { getPrettyCodeSampleLanguage } from "./util.ts";

export abstract class MdxSite extends MarkdownSite {
  // There isn't any difference between MdxSite and MarkdownSite at the moment,
  // but we still want the named class for consistency
}

export abstract class MdxRenderer extends MarkdownRenderer {
  #imports = new Map<
    string,
    { defaultAlias: string | undefined; namedImports: Set<string> }
  >();

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
        imports += `import {\n${Array.from(symbols.namedImports).sort().join(",\n  ")}\n} from "${importPath}";\n`;
      } else {
        imports += `import "${importPath}";\n`;
      }
    }
    const { contents, metadata } = super.render();
    let data = "";
    if (imports) {
      data += imports + "\n\n";
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

  protected override handleCreateOperationTitle(cb: () => void): void {
    this.insertComponentImport("OperationTitleSection");
    this.appendLine(`<OperationTitleSection slot="title">`);
    cb();
    this.appendLine(`</OperationTitleSection>`);
  }

  protected override handleCreateOperationSummary(cb: () => void) {
    this.insertComponentImport("OperationSummarySection");
    this.appendLine(`<OperationSummarySection slot="summary">`);
    cb();
    this.appendLine(`</OperationSummarySection>`);
  }

  protected override handleCreateOperationDescription(cb: () => void) {
    this.insertComponentImport("OperationDescriptionSection");
    this.appendLine(`<OperationDescriptionSection slot="description">`);
    cb();
    this.appendLine(`</OperationDescriptionSection>`);
  }

  public override createCodeSamplesSection(
    ...[cb]: RendererCreateCodeSamplesSectionArgs
  ) {
    this.enterContext({ id: "code-samples", type: "section" });
    this.insertComponentImport("OperationCodeSamplesSection");
    this.appendLine(`<OperationCodeSamplesSection slot="code-samples">`);
    this.createTabbedSection(() => {
      this.createSectionTitle(() =>
        this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, "Code Samples", {
          id: this.getCurrentId(),
        })
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

  protected override handleCreateRequestDisplayType(cb: () => void) {
    this.insertComponentImport("OperationRequestBodyDisplayTypeSection");
    this.appendLine(
      '<OperationRequestBodyDisplayTypeSection slot="request-body-display-type">'
    );
    cb();
    this.appendLine("</OperationRequestBodyDisplayTypeSection>");
  }

  protected override handleCreateRequestDescription(cb: () => void) {
    this.insertComponentImport("OperationRequestBodyDescriptionSection");
    this.appendLine(
      '<OperationRequestBodyDescriptionSection slot="request-body-description">'
    );
    cb();
    this.appendLine("</OperationRequestBodyDescriptionSection>");
  }

  protected override handleCreateRequestExamples(cb: () => void) {
    this.insertComponentImport("OperationRequestBodyExamplesSection");
    this.appendLine(
      '<OperationRequestBodyExamplesSection slot="request-body-examples">'
    );
    cb();
    this.appendLine("</OperationRequestBodyExamplesSection>");
  }

  protected override handleCreateRequestDefaultValue(cb: () => void) {
    this.insertComponentImport("OperationRequestBodyDefaultValueSection");
    this.appendLine(
      '<OperationRequestBodyDefaultValueSection slot="request-body-default-value">'
    );
    cb();
    this.appendLine("</OperationRequestBodyDefaultValueSection>");
  }

  protected override handleCreateResponseDisplayType(cb: () => void) {
    this.insertComponentImport("OperationResponseBodyDisplayTypeSection");
    this.appendLine(
      '<OperationResponseBodyDisplayTypeSection slot="response-body-display-type">'
    );
    cb();
    this.appendLine("</OperationResponseBodyDisplayTypeSection>");
  }

  protected override handleCreateResponseDescription(cb: () => void) {
    this.insertComponentImport("OperationResponseBodyDescriptionSection");
    this.appendLine(
      '<OperationResponseBodyDescriptionSection slot="response-body-description">'
    );
    cb();
    this.appendLine("</OperationResponseBodyDescriptionSection>");
  }

  protected override handleCreateResponseExamples(cb: () => void) {
    this.insertComponentImport("OperationResponseBodyExamplesSection");
    this.appendLine(
      '<OperationResponseBodyExamplesSection slot="response-body-examples">'
    );
    cb();
    this.appendLine("</OperationResponseBodyExamplesSection>");
  }

  protected override handleCreateResponseDefaultValue(cb: () => void) {
    this.insertComponentImport("OperationResponseBodyDefaultValueSection");
    this.appendLine(
      '<OperationResponseBodyDefaultValueSection slot="response-body-default-value">'
    );
    cb();
    this.appendLine("</OperationResponseBodyDefaultValueSection>");
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
      {
        hasFrontMatter,
        createTitle,
        createDescription,
        createExamples,
        createDefaultValue,
        isTopLevel,
      },
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
  hasFrontMatter={${hasFrontMatter ? "true" : "false"}}
  expandByDefault={${expandByDefault}}
>`
    );

    this.insertComponentImport("ExpandableBreakoutTitle");
    this.appendLine(`<ExpandableBreakoutTitle slot="title">`);
    createTitle();
    this.appendLine("</ExpandableBreakoutTitle>");

    if (createDescription) {
      this.insertComponentImport("ExpandableBreakoutDescription");
      this.appendLine(`<ExpandableBreakoutDescription slot="description">`);
      createDescription();
      this.appendLine("</ExpandableBreakoutDescription>");
    }

    if (createExamples) {
      this.insertComponentImport("ExpandableBreakoutExamples");
      this.appendLine(`<ExpandableBreakoutExamples slot="examples">`);
      createExamples();
      this.appendLine("</ExpandableBreakoutExamples>");
    }

    if (createDefaultValue) {
      this.insertComponentImport("ExpandableBreakoutDefaultValue");
      this.appendLine(`<ExpandableBreakoutDefaultValue slot="defaultValue">`);
      createDefaultValue();
      this.appendLine("</ExpandableBreakoutDefaultValue>");
    }

    this.appendLine("</ExpandableBreakout>");
  }

  protected override handleCreateExpandableProperty(
    ...[
      {
        typeInfo,
        annotations,
        rawTitle,
        isTopLevel,
        hasFrontMatter,
        createDescription,
        createExamples,
        createDefaultValue,
      },
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
  hasFrontMatter={${hasFrontMatter ? "true" : "false"}}
  expandByDefault={${expandByDefault}}
>`
    );

    this.insertComponentImport("ExpandablePropertyTitle");
    this.appendLine(`<ExpandablePropertyTitle slot="title">`);
    this.createHeading(HEADINGS.PROPERTY_HEADING_LEVEL, rawTitle, {
      id: this.getCurrentId(),
      escape: "mdx",
    });
    this.appendLine("</ExpandablePropertyTitle>");

    if (createDescription) {
      this.insertComponentImport("ExpandablePropertyDescription");
      this.appendLine(`<ExpandablePropertyDescription slot="description">`);
      createDescription();
      this.appendLine("</ExpandablePropertyDescription>");
    }

    if (createExamples) {
      this.insertComponentImport("ExpandablePropertyExamples");
      this.appendLine(`<ExpandablePropertyExamples slot="examples">`);
      createExamples();
      this.appendLine("</ExpandablePropertyExamples>");
    }

    if (createDefaultValue) {
      this.insertComponentImport("ExpandablePropertyDefaultValue");
      this.appendLine(`<ExpandablePropertyDefaultValue slot="defaultValue">`);
      createDefaultValue();
      this.appendLine("</ExpandablePropertyDefaultValue>");
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

  public override createSection(...[cb]: RendererCreateSectionArgs) {
    this.insertComponentImport("Section");
    this.appendLine("<Section>");
    cb();
    this.appendLine("</Section>");
  }

  public override createSectionTitle(...[cb]: RendererCreateSectionTitleArgs) {
    this.insertComponentImport("SectionTitle");
    this.appendLine(`<SectionTitle slot="title">`);
    cb();
    this.appendLine("</SectionTitle>");
  }

  public override createSectionContent(
    ...[cb, { id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.insertComponentImport("SectionContent");
    this.appendLine(
      `<SectionContent slot="content"${id ? ` id="${id}"` : ""}>`
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
}
