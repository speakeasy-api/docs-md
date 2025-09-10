import { dirname, relative } from "node:path";

import type {
  CodeSampleProps,
  DebugPlaceholderProps,
  ExpandableBreakoutDefaultValueProps,
  ExpandableBreakoutDescriptionProps,
  ExpandableBreakoutExamplesProps,
  ExpandableBreakoutProps,
  ExpandableBreakoutTitleProps,
  ExpandablePropertyDefaultValueProps,
  ExpandablePropertyDescriptionProps,
  ExpandablePropertyExamplesProps,
  ExpandablePropertyProps,
  ExpandablePropertyTitleProps,
  ExpandableSectionProps,
  FrontMatterDisplayTypeProps,
  OperationCodeSamplesSectionProps,
  OperationDescriptionSectionProps,
  OperationParametersSectionProps,
  OperationProps,
  OperationRequestBodyDefaultValueSectionProps,
  OperationRequestBodyDescriptionSectionProps,
  OperationRequestBodyDisplayTypeSectionProps,
  OperationRequestBodyExamplesSectionProps,
  OperationRequestBodySectionProps,
  OperationResponseBodyDefaultValueSectionProps,
  OperationResponseBodyDescriptionSectionProps,
  OperationResponseBodyDisplayTypeSectionProps,
  OperationResponseBodyExamplesSectionProps,
  OperationResponseBodySectionProps,
  OperationSecuritySectionProps,
  OperationSummarySectionProps,
  OperationTitleSectionProps,
  SectionContentProps,
  SectionProps,
  SectionTabProps,
  SectionTitleProps,
  TabbedSectionProps,
  TryItNowProps,
} from "../../../react/index.ts";
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

  #createComponentOpeningTag<Props extends Record<string, unknown>>(
    symbol: string,
    props: Props,
    { selfClosing }: { selfClosing: boolean }
  ) {
    this.insertComponentImport(symbol);

    function serializeProps(separator: string) {
      return Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === "string") {
            if (value.includes("\n")) {
              return `${separator}${key}={\`${value}\`}`;
            }
            return `${separator}${key}="${value}"`;
          } else if (value !== undefined) {
            return `${separator}${key}={${JSON.stringify(value)}}`;
          } else {
            return "";
          }
        })
        .join("");
    }

    let serializedProps = serializeProps(" ");
    const isMultiline = serializedProps.length > 80;
    if (isMultiline) {
      serializedProps = serializeProps("\n  ");
    }
    return `<${symbol}${serializedProps}${selfClosing ? (isMultiline ? "\n/" : " /") : isMultiline ? "\n" : ""}>`;
  }

  #createComponentClosingTag(symbol: string) {
    return `</${symbol}>`;
  }

  #appendComponent<Props extends Record<string, unknown>>(
    symbol: string,
    props: Props,
    cb?: () => void
  ) {
    this.appendLine(
      this.#createComponentOpeningTag<Props>(symbol, props, {
        selfClosing: !cb,
      })
    );
    if (cb) {
      cb();
      this.appendLine(this.#createComponentClosingTag(symbol));
    }
  }

  #createComponent<Props extends Record<string, unknown>>(
    symbol: string,
    props: Props,
    cb: () => void
  ) {
    if (cb) {
      return (
        this.#createComponentOpeningTag<Props>(symbol, props, {
          selfClosing: false,
        }) +
        cb() +
        this.#createComponentClosingTag(symbol)
      );
    } else {
      return this.#createComponentOpeningTag<Props>(symbol, props, {
        selfClosing: true,
      });
    }
  }

  public override createPill(
    ...[variant, cb, { append = false } = {}]: RendererCreatePillArgs
  ) {
    const pill = this.#createComponent("Pill", { variant }, cb);
    if (append) {
      this.appendLine(pill);
    }
    return pill;
  }

  public override createOperationSection(...args: RendererCreateOperationArgs) {
    this.#appendComponent<OperationProps>("Operation", {}, () =>
      super.createOperationSection(...args)
    );
  }

  protected override handleCreateOperationTitle(cb: () => void): void {
    this.#appendComponent<OperationTitleSectionProps>(
      "OperationTitleSection",
      { slot: "title" },
      cb
    );
  }

  protected override handleCreateOperationSummary(cb: () => void) {
    this.#appendComponent<OperationSummarySectionProps>(
      "OperationSummarySection",
      { slot: "summary" },
      cb
    );
  }

  protected override handleCreateOperationDescription(cb: () => void) {
    this.#appendComponent<OperationDescriptionSectionProps>(
      "OperationDescriptionSection",
      { slot: "description" },
      cb
    );
  }

  public override createCodeSamplesSection(
    ...[cb]: RendererCreateCodeSamplesSectionArgs
  ) {
    this.enterContext({ id: "code-samples", type: "section" });
    this.#appendComponent<OperationCodeSamplesSectionProps>(
      "OperationCodeSamplesSection",
      { slot: "code-samples" },
      () => {
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
              this.createTabbedSectionTab(
                () => this.createText(getPrettyCodeSampleLanguage(language)),
                { id: this.getCurrentId() }
              );
              this.createSectionContent(
                () => {
                  this.#appendComponent<TryItNowProps>("TryItNow", {
                    externalDependencies,
                    defaultValue,
                  });
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
                  this.#appendComponent<CodeSampleProps>("CodeSample", {}, () =>
                    this.createCode(value, {
                      language,
                      variant: "default",
                      style: "block",
                    })
                  );
                },
                {
                  id: this.getCurrentId(),
                }
              );
              this.exitContext();
            },
          });
        });
      }
    );
    this.exitContext();
  }

  public override createSecuritySection(
    ...args: RendererCreateSecuritySectionArgs
  ) {
    this.#appendComponent<OperationSecuritySectionProps>(
      "OperationSecuritySection",
      { slot: "security" },
      () => super.createSecuritySection(...args)
    );
  }

  public override createParametersSection(
    ...args: RendererCreateParametersSectionArgs
  ) {
    this.#appendComponent<OperationParametersSectionProps>(
      "OperationParametersSection",
      { slot: "parameters" },
      () => super.createParametersSection(...args)
    );
  }

  public override createRequestSection(
    ...args: RendererCreateRequestSectionArgs
  ) {
    this.#appendComponent<OperationRequestBodySectionProps>(
      "OperationRequestBodySection",
      { slot: "request-body" },
      () => super.createRequestSection(...args)
    );
  }

  public override createResponsesSection(...args: RendererCreateResponsesArgs) {
    this.#appendComponent<OperationResponseBodySectionProps>(
      "OperationResponseBodySection",
      { slot: "response-body" },
      () => super.createResponsesSection(...args)
    );
  }

  protected override handleCreateRequestDisplayType(cb: () => void) {
    this.#appendComponent<OperationRequestBodyDisplayTypeSectionProps>(
      "OperationRequestBodyDisplayTypeSection",
      { slot: "request-body-display-type" },
      cb
    );
  }

  protected override handleCreateRequestDescription(cb: () => void) {
    this.#appendComponent<OperationRequestBodyDescriptionSectionProps>(
      "OperationRequestBodyDescriptionSection",
      { slot: "request-body-description" },
      cb
    );
  }

  protected override handleCreateRequestExamples(cb: () => void) {
    this.#appendComponent<OperationRequestBodyExamplesSectionProps>(
      "OperationRequestBodyExamplesSection",
      { slot: "request-body-examples" },
      cb
    );
  }

  protected override handleCreateRequestDefaultValue(cb: () => void) {
    this.#appendComponent<OperationRequestBodyDefaultValueSectionProps>(
      "OperationRequestBodyDefaultValueSection",
      { slot: "request-body-default-value" },
      cb
    );
  }

  protected override handleCreateResponseDisplayType(cb: () => void) {
    this.#appendComponent<OperationResponseBodyDisplayTypeSectionProps>(
      "OperationResponseBodyDisplayTypeSection",
      { slot: "response-body-display-type" },
      cb
    );
  }

  protected override handleCreateResponseDescription(cb: () => void) {
    this.#appendComponent<OperationResponseBodyDescriptionSectionProps>(
      "OperationResponseBodyDescriptionSection",
      { slot: "response-body-description" },
      cb
    );
  }

  protected override handleCreateResponseExamples(cb: () => void) {
    this.#appendComponent<OperationResponseBodyExamplesSectionProps>(
      "OperationResponseBodyExamplesSection",
      { slot: "response-body-examples" },
      cb
    );
  }

  protected override handleCreateResponseDefaultValue(cb: () => void) {
    this.#appendComponent<OperationResponseBodyDefaultValueSectionProps>(
      "OperationResponseBodyDefaultValueSection",
      { slot: "response-body-default-value" },
      cb
    );
  }

  protected override handleCreateSecurity(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>("ExpandableSection", {}, cb);
  }

  protected override handleCreateParameters(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>("ExpandableSection", {}, cb);
  }

  protected override handleCreateBreakouts(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>("ExpandableSection", {}, cb);
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
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;
    this.#appendComponent<ExpandableBreakoutProps>(
      "ExpandableBreakout",
      {
        slot: "entry",
        id,
        headingId: this.getCurrentId(),
        parentId,
        hasFrontMatter,
        expandByDefault,
      },
      () => {
        this.#appendComponent<ExpandableBreakoutTitleProps>(
          "ExpandableBreakoutTitle",
          { slot: "title" },
          createTitle
        );

        if (createDescription) {
          this.#appendComponent<ExpandableBreakoutDescriptionProps>(
            "ExpandableBreakoutDescription",
            { slot: "description" },
            createDescription
          );
        }

        if (createExamples) {
          this.#appendComponent<ExpandableBreakoutExamplesProps>(
            "ExpandableBreakoutExamples",
            { slot: "examples" },
            createExamples
          );
        }

        if (createDefaultValue) {
          this.#appendComponent<ExpandableBreakoutDefaultValueProps>(
            "ExpandableBreakoutDefaultValue",
            { slot: "defaultValue" },
            createDefaultValue
          );
        }
      }
    );
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
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;

    this.#appendComponent<ExpandablePropertyProps>(
      "ExpandableProperty",
      {
        slot: "entry",
        id,
        headingId: this.getCurrentId(),
        parentId,
        typeInfo,
        typeAnnotations: annotations,
        hasFrontMatter,
        expandByDefault,
      },
      () => {
        this.#appendComponent<ExpandablePropertyTitleProps>(
          "ExpandablePropertyTitle",
          { slot: "title" },
          () => {
            this.createHeading(HEADINGS.PROPERTY_HEADING_LEVEL, rawTitle, {
              id: this.getCurrentId(),
              escape: "mdx",
            });
          }
        );

        if (createDescription) {
          this.#appendComponent<ExpandablePropertyDescriptionProps>(
            "ExpandablePropertyDescription",
            { slot: "description" },
            createDescription
          );
        }

        if (createExamples) {
          this.#appendComponent<ExpandablePropertyExamplesProps>(
            "ExpandablePropertyExamples",
            { slot: "examples" },
            createExamples
          );
        }

        if (createDefaultValue) {
          this.#appendComponent<ExpandablePropertyDefaultValueProps>(
            "ExpandablePropertyDefaultValue",
            { slot: "defaultValue" },
            createDefaultValue
          );
        }
      }
    );
  }

  public override createFrontMatterDisplayType(
    ...[{ typeInfo }]: RendererCreateFrontMatterDisplayTypeArgs
  ) {
    this.#appendComponent<FrontMatterDisplayTypeProps>(
      "FrontMatterDisplayType",
      { typeInfo }
    );
  }

  public override createSection(...[cb]: RendererCreateSectionArgs) {
    this.#appendComponent<SectionProps>("Section", {}, cb);
  }

  public override createSectionTitle(...[cb]: RendererCreateSectionTitleArgs) {
    this.#appendComponent<SectionTitleProps>(
      "SectionTitle",
      { slot: "title" },
      cb
    );
  }

  public override createSectionContent(
    ...[cb, { id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.#appendComponent<SectionContentProps>(
      "SectionContent",
      { slot: "content", id },
      cb
    );
  }

  protected override createTabbedSection(
    ...[cb]: RendererCreateTabbedSectionArgs
  ) {
    // We have to do a manual Omit here, since TabbedSectionProps.children is
    // specially defined and not a standard PropsWithChildren type
    this.#appendComponent<Omit<TabbedSectionProps, "children">>(
      "TabbedSection",
      {},
      cb
    );
  }

  protected override createTabbedSectionTab(
    ...[cb, { id }]: RendererCreateTabbedSectionTabArgs
  ) {
    this.#appendComponent<SectionTabProps>(
      "SectionTab",
      { slot: "tab", id },
      cb
    );
  }

  public override createDebugPlaceholder(
    ...[cb]: RendererCreateDebugPlaceholderArgs
  ) {
    this.#appendComponent<DebugPlaceholderProps>("DebugPlaceholder", {}, cb);
  }
}
