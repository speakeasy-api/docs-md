import { dirname, join, relative } from "node:path";

import type {
  CodeSampleProps,
  DebugPlaceholderProps,
  EmbedProps,
  EmbedTriggerProps,
  ExpandableBreakoutDefaultValueProps,
  ExpandableBreakoutDescriptionProps,
  ExpandableBreakoutExamplesProps,
  ExpandableBreakoutPropertiesProps,
  ExpandableBreakoutProps,
  ExpandableBreakoutTitleProps,
  ExpandablePropertyBreakoutsProps,
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
  OperationRequestBodyDescriptionSectionProps,
  OperationRequestBodyDisplayTypeSectionProps,
  OperationRequestBodyExamplesSectionProps,
  OperationRequestBodySectionProps,
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
  TagDescriptionProps,
  TagProps,
  TagTitleProps,
  TryItNowProps,
} from "@speakeasy-api/docs-md-react";

import { HEADINGS } from "../content/constants.ts";
import { getOnPageComplete, getSettings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";
import type {
  RendererConstructorArgs,
  RendererCreateCodeArgs,
  RendererCreateCodeSamplesSectionArgs,
  RendererCreateDebugPlaceholderArgs,
  RendererCreateEmbedArgs,
  RendererCreateExpandableBreakoutArgs,
  RendererCreateExpandablePropertyArgs,
  RendererCreateFrontMatterDisplayTypeArgs,
  RendererCreateHeadingArgs,
  RendererCreateOperationArgs,
  RendererCreateParametersSectionArgs,
  RendererCreatePillArgs,
  RendererCreateRequestExamplesSectionArgs,
  RendererCreateRequestSectionArgs,
  RendererCreateResponsesArgs,
  RendererCreateResponsesExamplesSectionArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateSecuritySectionArgs,
  RendererCreateTabbedSectionArgs,
  RendererCreateTabbedSectionTabArgs,
  RendererCreateTagSectionArgs,
  SiteBuildPagePathArgs,
  SiteCreateEmbedArgs,
  SiteGetRendererArgs,
} from "./base.ts";
import { MarkdownRenderer, MarkdownSite } from "./markdown.ts";
import { escapeText, getPrettyCodeSampleLanguage } from "./util.ts";

export class MdxSite extends MarkdownSite {
  #embedsCreated = new Set<string>();
  #embedStack: string[] = [];

  public override buildPagePath(
    ...[slug, { appendIndex = false } = {}]: SiteBuildPagePathArgs
  ): string {
    return this.compilerConfig.buildPagePath(slug, { appendIndex });
  }

  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new MdxRenderer({ ...options }, this);
  }

  public override createEmbed(
    ...[{ slug, createdEmbeddedContent }]: SiteCreateEmbedArgs
  ) {
    if (!this.docsData) {
      throw new InternalError("Docs data not set");
    }

    // Check if this is a circular reference
    if (this.#embedStack.includes(slug)) {
      return undefined;
    }
    this.#embedStack.push(slug);

    const {
      output: { embedOutDir },
    } = getSettings();
    if (!embedOutDir) {
      throw new InternalError(
        "Embed output directory not set, but should have been caught by the settings parser"
      );
    }

    const loaderPath = join(embedOutDir, "loaders", `${slug}.tsx`);
    const embedPath = join(embedOutDir, "contents", `${slug}.mdx`);
    if (this.#embedsCreated.has(slug)) {
      this.#embedStack.pop();
      return loaderPath;
    }
    this.#embedsCreated.add(slug);

    // Create the lazy loader
    const importPath = relative(dirname(loaderPath), embedPath);
    const loaderContents = `import { lazy, Suspense } from "react";

// This import needs to have a literal value so bundlers can statically
// analyze this component. This is why we don't use a generic component that
// takes in a 'src' property, or anything like that.
const Contents = lazy(() => import("${importPath}"));

export default function() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contents />
    </Suspense>
  );
}
`;
    getOnPageComplete()(loaderPath, loaderContents);

    // Create the embed contents
    const renderer = this.getRenderer({
      currentPageSlug: slug,
      currentPagePath: embedPath,
      site: this,
      docsData: this.docsData,
      compilerConfig: this.compilerConfig,
      isEmbed: true,
    });

    renderer.enterContext({
      id: `embed-${slug}`,
      type: "embed",
    });
    renderer.enterContext({ id: slug, type: "schema" });

    renderer.createEmbedWrapper(() => {
      createdEmbeddedContent(renderer);
    });

    renderer.exitContext();
    renderer.exitContext();

    const { contents } = renderer.render();
    getOnPageComplete()(embedPath, contents);

    this.#embedStack.pop();
    return loaderPath;
  }
}

let slugCounter = 0;

class MdxRenderer extends MarkdownRenderer {
  // Mapping of import path to imported symbols to imported symbol alias
  #imports = new Map<string, Map<string, string>>();
  #frontMatter: string | undefined;
  #site: MdxSite;
  #hasEmbed = false;

  constructor(options: RendererConstructorArgs, site: MdxSite) {
    super(options);
    this.#site = site;
    this.#frontMatter = this.compilerConfig.buildPagePreamble(
      options.frontMatter
    );
  }

  #insertNamedImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, new Map());
    }
    this.#imports.get(importPath)?.set(symbol, symbol);
  }

  #insertDefaultImport(importPath: string, alias: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, new Map());
    }
    this.#imports.get(importPath)?.set("default", alias);
  }

  #insertComponentImport(symbol: string) {
    this.#insertNamedImport(this.compilerConfig.componentPackageName, symbol);
  }

  #createComponentOpeningTag<Props extends Record<string, unknown>>({
    symbol,
    props,
    selfClosing,
    noImport = false,
  }: {
    symbol: string;
    props: Props;
    selfClosing: boolean;
    noImport?: boolean;
  }) {
    if (!noImport) {
      this.#insertComponentImport(symbol);
    }

    function serializeProps(separator: string) {
      if (!props) {
        return "";
      }
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
    {
      symbol,
      props,
      noImport,
    }: {
      symbol: string;
      props: Props;
      noImport?: boolean;
    },
    cb?: () => void
  ) {
    this.appendLine(
      this.#createComponentOpeningTag<Props>({
        symbol,
        props,
        selfClosing: !cb,
        noImport,
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
        this.#createComponentOpeningTag<Props>({
          symbol,
          props,
          selfClosing: false,
        }) +
        cb() +
        this.#createComponentClosingTag(symbol)
      );
    } else {
      return this.#createComponentOpeningTag<Props>({
        symbol,
        props,
        selfClosing: true,
      });
    }
  }

  protected override getIdSeparator() {
    return this.compilerConfig.elementIdSeparator ?? "+";
  }

  public createEmbedWrapper(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>(
      {
        symbol: "ExpandableSection",
        props: {},
      },
      cb
    );
  }

  public override createEmbed(...[args]: RendererCreateEmbedArgs) {
    if (!this.#hasEmbed && !this.hasParentContextType("embed")) {
      this.#hasEmbed = true;
      this.#insertComponentImport("EmbedProvider");
    }

    // If we don't have a slug, make one up
    // TODO: fix the reason we're not getting a name on the generator side.
    if (!args.slug) {
      args.slug = `EmbedNameMissing${slugCounter++}`;
    }
    args.slug = args.slug.toLowerCase();

    const absolutePath = this.#site.createEmbed(args);

    // If we get back undefined, it means we have a circular reference
    if (!absolutePath) {
      // TODO: handle this circular reference better
      return;
    }

    const { triggerText, embedTitle, slug } = args;

    this.#appendComponent<EmbedProps>(
      { symbol: "Embed", props: { slot: "embed" } },
      () => {
        const componentName = `Embed${slug}`;

        this.#appendComponent<EmbedTriggerProps>(
          {
            symbol: "EmbedTrigger",
            props: { slot: "trigger", embedTitle, triggerText },
          },
          () => {
            this.#appendComponent({
              symbol: componentName,
              props: {},
              noImport: true,
            });
          }
        );

        let importPath = relative(dirname(this.getPagePath()), absolutePath);

        // When an embed imports another embed, we don't get the leading `./`
        if (!importPath.startsWith(".")) {
          importPath = `./${importPath}`;
        }
        this.#insertDefaultImport(importPath, componentName);
      }
    );
  }

  public override render() {
    // Render the main content
    const { contents, metadata } = super.render();

    // If we have front matter, add it to the top of the file
    let frontMatter = this.#frontMatter ? this.#frontMatter + "\n" : "";

    // Add imports after front matter
    for (const [importPath, symbols] of this.#imports) {
      const defaultImportName = symbols.get("default");
      const nonDefaultImports = Array.from(symbols)
        .filter(([symbol]) => symbol !== "default")
        .map(([symbol, alias]) =>
          alias !== symbol ? `${alias} as ${symbol}` : symbol
        )
        .sort()
        .join(",\n  ");
      if (defaultImportName && nonDefaultImports.length > 0) {
        frontMatter += `import ${defaultImportName}, {\n  ${nonDefaultImports}\n} from "${importPath}";\n`;
      } else if (defaultImportName) {
        frontMatter += `import ${defaultImportName} from "${importPath}";\n`;
      } else {
        frontMatter += `import {\n  ${nonDefaultImports}\n} from "${importPath}";\n`;
      }
    }

    // Add a blank line after front matter, if it exists
    if (frontMatter) {
      frontMatter += "\n";
    }

    // Add the embed provider, if we need one
    if (this.#hasEmbed && !this.hasParentContextType("embed")) {
      frontMatter += "<EmbedProvider />\n\n";
    }

    // Return the final result
    return {
      contents: frontMatter + contents,
      metadata,
    };
  }

  public override createHeading(
    ...[
      level,
      text,
      { escape = "markdown", id, append = true } = {},
    ]: RendererCreateHeadingArgs
  ) {
    let line = `${`#`.repeat(level)} ${escapeText(text, { escape })}`;
    if (id) {
      if (this.compilerConfig.formatHeadingId) {
        line += ` ${this.compilerConfig.formatHeadingId(id)}`;
      } else {
        line += ` \\{#${id}\\}`;
      }
    }
    if (append) {
      this.appendLine(line);
    }
    return line;
  }

  public override createCode(...[text, options]: RendererCreateCodeArgs) {
    let line: string;
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        line = `<code>${escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      } else {
        const escapedText = escapeText(text, {
          escape: options?.escape ?? "html",
        }).replaceAll("`", "\\`");
        this.#insertComponentImport("Code");
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

  public override createPill(
    ...[variant, cb, { append = false } = {}]: RendererCreatePillArgs
  ) {
    const pill = this.#createComponent("Pill", { variant }, cb);
    if (append) {
      this.appendLine(pill);
    }
    return pill;
  }

  public override createTagSection(
    ...[{ title, description }]: RendererCreateTagSectionArgs
  ) {
    this.#appendComponent<TagProps>(
      {
        symbol: "Tag",
        props: { slot: "tag" },
      },
      () => {
        this.#appendComponent<TagTitleProps>(
          {
            symbol: "TagTitle",
            props: { slot: "title" },
          },
          title
        );
        if (description) {
          this.#appendComponent<TagDescriptionProps>(
            {
              symbol: "TagDescription",
              props: { slot: "description" },
            },
            description
          );
        }
      }
    );
  }

  public override createOperationSection(...args: RendererCreateOperationArgs) {
    this.#appendComponent<OperationProps>(
      {
        symbol: "Operation",
        props: {},
      },
      () => super.createOperationSection(...args)
    );
  }

  protected override handleCreateOperationTitle(cb: () => void): void {
    this.#appendComponent<OperationTitleSectionProps>(
      {
        symbol: "OperationTitleSection",
        props: { slot: "title" },
      },
      cb
    );
  }

  protected override handleCreateOperationSummary(cb: () => void) {
    this.#appendComponent<OperationSummarySectionProps>(
      {
        symbol: "OperationSummarySection",
        props: { slot: "summary" },
      },
      cb
    );
  }

  protected override handleCreateOperationDescription(cb: () => void) {
    this.#appendComponent<OperationDescriptionSectionProps>(
      {
        symbol: "OperationDescriptionSection",
        props: { slot: "description" },
      },
      cb
    );
  }

  public override createCodeSamplesSection(
    ...[cb]: RendererCreateCodeSamplesSectionArgs
  ) {
    this.enterContext({ id: "code-samples", type: "section" });
    this.#appendComponent<OperationCodeSamplesSectionProps>(
      {
        symbol: "OperationCodeSamplesSection",
        props: { slot: "code-samples" },
      },
      () => {
        this.createTabbedSection(() => {
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
                  this.#appendComponent<TryItNowProps>({
                    symbol: "TryItNow",
                    props: {
                      externalDependencies,
                      defaultValue,
                    },
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
                  this.#appendComponent<CodeSampleProps>(
                    {
                      symbol: "CodeSample",
                      props: {},
                    },
                    () =>
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
      {
        symbol: "OperationSecuritySection",
        props: { slot: "security" },
      },
      () => super.createSecuritySection(...args)
    );
  }

  public override createParametersSection(
    ...args: RendererCreateParametersSectionArgs
  ) {
    this.#appendComponent<OperationParametersSectionProps>(
      {
        symbol: "OperationParametersSection",
        props: { slot: "parameters" },
      },
      () => super.createParametersSection(...args)
    );
  }

  public override createRequestExamplesSection(
    ...[cb]: RendererCreateRequestExamplesSectionArgs
  ) {
    this.#appendComponent<OperationRequestBodyExamplesSectionProps>(
      {
        symbol: "OperationRequestBodyExamplesSection",
        props: { slot: "request-body-examples" },
      },
      () => super.createRequestExamplesSection(cb)
    );
  }

  public override createRequestSection(
    ...args: RendererCreateRequestSectionArgs
  ) {
    this.#appendComponent<OperationRequestBodySectionProps>(
      {
        symbol: "OperationRequestBodySection",
        props: { slot: "request-body" },
      },
      () => super.createRequestSection(...args)
    );
  }

  public override createResponsesExamplesSection(
    ...args: RendererCreateResponsesExamplesSectionArgs
  ) {
    this.#appendComponent<OperationResponseBodyExamplesSectionProps>(
      {
        symbol: "OperationResponseBodyExamplesSection",
        props: { slot: "response-body-examples" },
      },
      () => super.createResponsesExamplesSection(...args)
    );
  }

  public override createResponsesSection(...args: RendererCreateResponsesArgs) {
    this.#appendComponent<OperationResponseBodySectionProps>(
      {
        symbol: "OperationResponseBodySection",
        props: { slot: "response-body" },
      },
      () => super.createResponsesSection(...args)
    );
  }

  protected override handleCreateRequestDisplayType(cb: () => void) {
    this.#appendComponent<OperationRequestBodyDisplayTypeSectionProps>(
      {
        symbol: "OperationRequestBodyDisplayTypeSection",
        props: { slot: "request-body-display-type" },
      },
      cb
    );
  }

  protected override handleCreateRequestDescription(cb: () => void) {
    this.#appendComponent<OperationRequestBodyDescriptionSectionProps>(
      {
        symbol: "OperationRequestBodyDescriptionSection",
        props: { slot: "request-body-description" },
      },
      cb
    );
  }

  protected override handleCreateResponseDisplayType(cb: () => void) {
    this.#appendComponent<OperationResponseBodyDisplayTypeSectionProps>(
      {
        symbol: "OperationResponseBodyDisplayTypeSection",
        props: { slot: "response-body-display-type" },
      },
      cb
    );
  }

  protected override handleCreateResponseDescription(cb: () => void) {
    this.#appendComponent<OperationResponseBodyDescriptionSectionProps>(
      {
        symbol: "OperationResponseBodyDescriptionSection",
        props: { slot: "response-body-description" },
      },
      cb
    );
  }

  protected override handleCreateSecurity(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>(
      {
        symbol: "ExpandableSection",
        props: {},
      },
      cb
    );
  }

  protected override handleCreateParameters(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>(
      {
        symbol: "ExpandableSection",
        props: {},
      },
      cb
    );
  }

  protected override handleCreateBreakouts(cb: () => void) {
    this.#appendComponent<ExpandableSectionProps>(
      {
        symbol: "ExpandableSection",
        props: {},
      },
      cb
    );
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
        hasExpandableContent,
        createTitle,
        createDescription,
        createExamples,
        createDefaultValue,
        createProperties,
        createEmbed,
        isTopLevel,
      },
    ]: RendererCreateExpandableBreakoutArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;
    this.#appendComponent<ExpandableBreakoutProps>(
      {
        symbol: "ExpandableBreakout",
        props: {
          slot: "entry",
          id,
          headingId: this.getCurrentId(),
          parentId,
          hasExpandableContent,
          expandByDefault,
        },
      },
      () => {
        this.#appendComponent<ExpandableBreakoutTitleProps>(
          {
            symbol: "ExpandableBreakoutTitle",
            props: { slot: "title" },
          },
          createTitle
        );

        if (createDescription) {
          this.#appendComponent<ExpandableBreakoutDescriptionProps>(
            {
              symbol: "ExpandableBreakoutDescription",
              props: { slot: "description" },
            },
            createDescription
          );
        }

        if (createExamples) {
          this.#appendComponent<ExpandableBreakoutExamplesProps>(
            {
              symbol: "ExpandableBreakoutExamples",
              props: { slot: "examples" },
            },
            createExamples
          );
        }

        if (createDefaultValue) {
          this.#appendComponent<ExpandableBreakoutDefaultValueProps>(
            {
              symbol: "ExpandableBreakoutDefaultValue",
              props: { slot: "defaultValue" },
            },
            createDefaultValue
          );
        }

        if (createProperties) {
          this.#appendComponent<ExpandableBreakoutPropertiesProps>(
            {
              symbol: "ExpandableBreakoutProperties",
              props: { slot: "properties" },
            },
            createProperties
          );
        }

        // Embeds handle their own component imports
        if (createEmbed) {
          createEmbed();
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
        hasExpandableContent,
        createDescription,
        createExamples,
        createDefaultValue,
        createBreakouts,
        createEmbed,
      },
    ]: RendererCreateExpandablePropertyArgs
  ) {
    const { id, parentId } = this.#getBreakoutIdInfo();
    const expandByDefault =
      getSettings().display.expandTopLevelPropertiesOnPageLoad && isTopLevel;

    this.#appendComponent<ExpandablePropertyProps>(
      {
        symbol: "ExpandableProperty",
        props: {
          slot: "entry",
          id,
          headingId: this.getCurrentId(),
          parentId,
          typeInfo,
          typeAnnotations: annotations,
          hasExpandableContent,
          expandByDefault,
        },
      },
      () => {
        this.#appendComponent<ExpandablePropertyTitleProps>(
          {
            symbol: "ExpandablePropertyTitle",
            props: { slot: "title" },
          },
          () => {
            this.createHeading(HEADINGS.PROPERTY_HEADING_LEVEL, rawTitle, {
              id: this.getCurrentId(),
              escape: "mdx",
            });
          }
        );

        if (createDescription) {
          this.#appendComponent<ExpandablePropertyDescriptionProps>(
            {
              symbol: "ExpandablePropertyDescription",
              props: { slot: "description" },
            },
            createDescription
          );
        }

        if (createExamples) {
          this.#appendComponent<ExpandablePropertyExamplesProps>(
            {
              symbol: "ExpandablePropertyExamples",
              props: { slot: "examples" },
            },
            createExamples
          );
        }

        if (createDefaultValue) {
          this.#appendComponent<ExpandablePropertyDefaultValueProps>(
            {
              symbol: "ExpandablePropertyDefaultValue",
              props: { slot: "defaultValue" },
            },
            createDefaultValue
          );
        }

        if (createBreakouts) {
          this.#appendComponent<ExpandablePropertyBreakoutsProps>(
            {
              symbol: "ExpandablePropertyBreakouts",
              props: { slot: "breakouts" },
            },
            createBreakouts
          );
        }

        // Embeds handle their own component imports
        if (createEmbed) {
          createEmbed();
        }
      }
    );
  }

  public override createFrontMatterDisplayType(
    ...[{ typeInfo }]: RendererCreateFrontMatterDisplayTypeArgs
  ) {
    this.#appendComponent<FrontMatterDisplayTypeProps>({
      symbol: "FrontMatterDisplayType",
      props: { typeInfo },
    });
  }

  public override createSection(...[cb]: RendererCreateSectionArgs) {
    this.#appendComponent<SectionProps>(
      {
        symbol: "Section",
        props: {},
      },
      cb
    );
  }

  public override createSectionTitle(...[cb]: RendererCreateSectionTitleArgs) {
    this.#appendComponent<SectionTitleProps>(
      {
        symbol: "SectionTitle",
        props: { slot: "title" },
      },
      cb
    );
  }

  public override createSectionContent(
    ...[cb, { id } = {}]: RendererCreateSectionContentArgs
  ) {
    this.#appendComponent<SectionContentProps>(
      {
        symbol: "SectionContent",
        props: { slot: "content", id },
      },
      cb
    );
  }

  protected override createTabbedSection(
    ...[cb]: RendererCreateTabbedSectionArgs
  ) {
    // We have to do a manual Omit here, since TabbedSectionProps.children is
    // specially defined and not a standard PropsWithChildren type
    this.#appendComponent<Omit<TabbedSectionProps, "children">>(
      {
        symbol: "TabbedSection",
        props: {},
      },
      cb
    );
  }

  protected override createTabbedSectionTab(
    ...[cb, { id }]: RendererCreateTabbedSectionTabArgs
  ) {
    this.#appendComponent<SectionTabProps>(
      {
        symbol: "SectionTab",
        props: { slot: "tab", id },
      },
      cb
    );
  }

  public override createDebugPlaceholder(
    ...[{ createTitle, createExample }]: RendererCreateDebugPlaceholderArgs
  ) {
    this.#appendComponent<DebugPlaceholderProps>(
      {
        symbol: "DebugPlaceholder",
        props: {},
      },
      () => {
        createTitle();
        this.createText("_OpenAPI example:_");
        createExample();
      }
    );
  }
}
