import { join, resolve } from "node:path";

import type {
  Chunk,
  PageMetadataTag,
} from "@speakeasy-api/docs-md-shared/types";
import type {
  DisplayTypeInfo,
  PageMetadata,
  PageMetadataOperation,
  PageMetadataSection,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared/types";
import { snakeCase } from "change-case";

import { HEADINGS } from "../content/constants.ts";
import { getSettings } from "../settings.ts";
import type { FrameworkConfig } from "../types/FrameworkConfig.ts";
import { InternalError } from "../util/internalError.ts";
import type {
  Context,
  RendererAlreadyInContextArgs,
  RendererConstructorArgs,
  RendererCreateCodeArgs,
  RendererCreateContextArgs,
  RendererCreateDebugPlaceholderArgs,
  RendererCreateEmbedArgs,
  RendererCreateExpandableBreakoutArgs,
  RendererCreateExpandablePropertyArgs,
  RendererCreateFrontMatterDisplayTypeArgs,
  RendererCreateHeadingArgs,
  RendererCreateListArgs,
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
  RendererCreateTagSectionArgs,
  RendererCreateTextArgs,
  RendererGetCurrentIdArgs,
  RendererHasParentContextTypeArgs,
  SiteBuildPagePathArgs,
  SiteCreateEmbedArgs,
  SiteCreatePageArgs,
} from "./base.ts";
import { Renderer } from "./base.ts";
import { Site } from "./base.ts";
import { escapeText } from "./util.ts";

export abstract class MarkdownSite extends Site {
  protected compilerConfig: FrameworkConfig;
  protected docsData: Map<string, Chunk> | undefined;

  constructor(compilerConfig: FrameworkConfig) {
    super();
    this.compilerConfig = compilerConfig;
  }

  public setDocsData(docsData: Map<string, Chunk>): void {
    this.docsData = docsData;
  }

  public buildPagePath(
    ...[slug, { appendIndex = false } = {}]: SiteBuildPagePathArgs
  ): string {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}.md`));
  }

  public createPage(...[path, slug, frontMatter]: SiteCreatePageArgs) {
    if (!this.docsData) {
      throw new InternalError("Docs data not set");
    }
    const renderer = this.getRenderer({
      currentPageSlug: slug,
      currentPagePath: path,
      site: this,
      docsData: this.docsData,
      frontMatter,
      compilerConfig: this.compilerConfig,
      isEmbed: false,
    });
    return renderer;
  }

  public createEmbed(..._args: SiteCreateEmbedArgs): string | undefined {
    throw new Error(`Base markdown renderer does not support createEmbed`);
  }
}

export abstract class MarkdownRenderer extends Renderer {
  #isFinalized = false;
  #contextStack: Context[] = [];
  #docsData: Map<string, Chunk>;
  #site: Site;
  #pageMetadata?: PageMetadata;
  #currentOperation?: PageMetadataOperation;
  #currentSection?: PageMetadataSection;
  #currentPagePath: string;
  #rendererLines: string[] = [];

  protected compilerConfig: FrameworkConfig;

  constructor({
    docsData,
    site,
    currentPageSlug,
    currentPagePath,
    frontMatter,
    compilerConfig,
  }: RendererConstructorArgs) {
    super();
    this.#docsData = docsData;
    this.#site = site;
    this.#currentPagePath = currentPagePath;
    if (currentPageSlug !== undefined && frontMatter) {
      this.#pageMetadata = {
        sidebarLabel: frontMatter.sidebarLabel,
        slug: currentPageSlug,
        tags: [],
      };
    }
    this.compilerConfig = compilerConfig;
  }

  protected getSite() {
    return this.#site;
  }

  public override getPagePath() {
    return this.#currentPagePath;
  }

  public override createEmbed(..._args: RendererCreateEmbedArgs) {
    throw new Error(`Base markdown renderer does not support createEmbed`);
  }

  public override createTagSection(
    ...[{ title, description }]: RendererCreateTagSectionArgs
  ) {
    title();
    if (description) {
      description();
    }
  }

  public override createOperationSection(
    ...[
      { tag, method, path, operationId, summary, description },
      cb,
    ]: RendererCreateOperationArgs
  ): void {
    const { showDebugPlaceholders } = getSettings().display;
    const id = `operation-${snakeCase(operationId)}`;
    this.enterContext({ id, type: "operation" });

    if (this.#pageMetadata) {
      const currentOperation = {
        elementId: id,
        method,
        path,
        operationId,
        summary,
      };
      this.#currentOperation = currentOperation;
      let tagMetadata: PageMetadataTag | undefined =
        this.#pageMetadata.tags.find(
          (tagMetadata) => tagMetadata.name === tag.chunkData.name
        );
      if (!tagMetadata) {
        tagMetadata = {
          name: tag.chunkData.name,
          operations: [],
        };
        this.#pageMetadata.tags.push(tagMetadata);
      }
      tagMetadata.operations.push(currentOperation);
    }

    this.handleCreateOperationTitle(() => {
      path = escapeText(path, {
        escape: "markdown",
      });
      this.createHeading(
        HEADINGS.SECTION_TITLE_HEADING_LEVEL,
        `${this.createPill("primary", () => `<b>${method.toUpperCase()}</b>`)} ${path}`,
        { id, escape: "none" }
      );
    });

    if (summary || showDebugPlaceholders) {
      this.handleCreateOperationSummary(() => {
        if (summary && description) {
          this.createText(`_${summary}_`);
        } else if (summary) {
          this.createText(summary);
        } else if (showDebugPlaceholders) {
          this.createDebugPlaceholder({
            createTitle: () => this.createText("No summary provided"),
            createExample: () =>
              this.createCode("summary: My awesome summary", {
                variant: "default",
                style: "block",
              }),
          });
        }
      });
    }

    if (description || showDebugPlaceholders) {
      this.handleCreateOperationDescription(() => {
        if (description) {
          this.createText(description);
        } else if (showDebugPlaceholders) {
          this.createDebugPlaceholder({
            createTitle: () => this.createText("No description provided"),
            createExample: () =>
              this.createCode("description: My awesome description", {
                variant: "default",
                style: "block",
              }),
          });
        }
      });
    }

    cb();

    this.#currentOperation = undefined;
    this.exitContext();
  }

  protected createTopLevelSection(
    {
      title,
      annotations = [],
    }: {
      title: string;
      annotations?: PropertyAnnotations[];
    },
    cb: () => void
  ): void {
    for (const annotation of annotations) {
      title += ` ${this.createPill(annotation.variant, () => annotation.title)}`;
    }
    this.createSection(() => {
      this.createSectionTitle(() =>
        this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
          id: this.getCurrentId(),
        })
      );
      this.createSectionContent(cb);
    });
  }

  public override createSecuritySection(
    ...[cb]: RendererCreateSecuritySectionArgs
  ): void {
    this.enterContext({ id: "security", type: "section" });
    if (this.#currentOperation) {
      this.#currentSection = {
        elementId: this.getCurrentId(),
        properties: [],
      };
      this.#currentOperation.security = this.#currentSection;
    }

    this.createTopLevelSection({ title: "Security" }, () =>
      this.handleCreateSecurity(cb)
    );

    this.#currentSection = undefined;
    this.exitContext();
  }

  protected handleCreateOperationTitle(cb: () => void) {
    cb();
  }

  protected handleCreateOperationSummary(cb: () => void) {
    cb();
  }

  protected handleCreateOperationDescription(cb: () => void) {
    cb();
  }

  protected handleCreateSecurity(cb: () => void) {
    cb();
  }

  public override createParametersSection(
    ...[cb]: RendererCreateParametersSectionArgs
  ): void {
    this.enterContext({ id: "parameters", type: "section" });
    if (this.#currentOperation) {
      this.#currentSection = {
        elementId: this.getCurrentId(),
        properties: [],
      };
      this.#currentOperation.parameters = this.#currentSection;
    }

    this.createTopLevelSection({ title: "Parameters" }, () =>
      this.handleCreateParameters(cb)
    );

    this.#currentSection = undefined;
    this.exitContext();
  }

  protected handleCreateParameters(cb: () => void) {
    cb();
  }

  public override createRequestSection(
    ...[
      {
        isOptional,
        createDisplayType,
        createDescription,
        createExamples,
        createBreakouts,
      },
    ]: RendererCreateRequestSectionArgs
  ): void {
    this.enterContext({ id: "request", type: "section" });
    if (this.#currentOperation) {
      this.#currentSection = {
        elementId: this.getCurrentId(),
        properties: [],
      };
      this.#currentOperation.requestBody = this.#currentSection;
    }
    const annotations: PropertyAnnotations[] = [];
    if (isOptional) {
      annotations.push({
        title: "Optional",
        variant: "info",
      });
    }
    this.createTopLevelSection(
      {
        title: "Request Body",
        annotations,
      },
      () => {
        if (createDisplayType) {
          this.handleCreateRequestDisplayType(createDisplayType);
        }
        if (createDescription) {
          this.handleCreateRequestDescription(createDescription);
        }
        if (createExamples) {
          this.handleCreateRequestExamples(createExamples);
        }
        this.handleCreateBreakouts(createBreakouts);
      }
    );
    this.#currentSection = undefined;
    this.exitContext();
  }

  public override createResponsesSection(
    ...[cb, { title = "Responses" } = {}]: RendererCreateResponsesArgs
  ): void {
    this.enterContext({ id: "responses", type: "section" });
    if (this.#currentOperation) {
      this.#currentOperation.responses = {};
    }
    this.createTabbedSection(() => {
      this.createSectionTitle(() =>
        this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
          id: this.getCurrentId(),
        })
      );
      cb(
        ({
          statusCode,
          contentType,
          createDisplayType,
          createDescription,
          createExamples,
          createBreakouts,
        }) => {
          this.enterContext({ id: statusCode, type: "section" });
          this.enterContext({
            id: contentType.replace("/", "-"),
            type: "section",
          });
          if (this.#currentOperation?.responses) {
            this.#currentSection = {
              elementId: this.getCurrentId(),
              properties: [],
            };
            this.#currentOperation.responses[`${statusCode}-${contentType}`] =
              this.#currentSection;
          }

          this.createTabbedSectionTab(() => this.createText(statusCode), {
            id: this.getCurrentId(),
          });
          this.createSectionContent(
            () => {
              if (createDisplayType) {
                this.handleCreateResponseDisplayType(createDisplayType);
              }
              if (createDescription) {
                this.handleCreateResponseDescription(createDescription);
              }
              if (createExamples) {
                this.handleCreateResponseExamples(createExamples);
              }
              this.handleCreateBreakouts(createBreakouts);
            },
            {
              id: this.getCurrentId(),
            }
          );

          this.#currentSection = undefined;
          this.exitContext();
          this.exitContext();
        }
      );
    });
    this.exitContext();
  }

  protected handleCreateRequestDisplayType(cb: () => void) {
    cb();
  }

  protected handleCreateRequestDescription(cb: () => void) {
    cb();
  }

  protected handleCreateRequestExamples(cb: () => void) {
    cb();
  }

  protected handleCreateResponseDisplayType(cb: () => void) {
    cb();
  }

  protected handleCreateResponseDescription(cb: () => void) {
    cb();
  }

  protected handleCreateResponseExamples(cb: () => void) {
    cb();
  }

  protected handleCreateBreakouts(cb: () => void) {
    cb();
  }

  public override createExpandableBreakout(
    ...[props]: RendererCreateExpandableBreakoutArgs
  ) {
    if (this.#currentSection && props.isTopLevel) {
      this.#currentSection.properties.push({
        elementId: this.getCurrentId(),
        name: props.rawTitle,
      });
    }
    this.handleCreateExpandableBreakout(props);
  }

  protected handleCreateExpandableBreakout(
    ...[
      { createTitle, createDescription, createExamples, createDefaultValue },
    ]: RendererCreateExpandableBreakoutArgs
  ) {
    createTitle();
    createDescription?.();
    createExamples?.();
    createDefaultValue?.();
  }

  public override createExpandableProperty(
    ...[props]: RendererCreateExpandablePropertyArgs
  ) {
    if (this.#currentSection && props.isTopLevel) {
      this.#currentSection.properties.push({
        elementId: this.getCurrentId(),
        name: props.rawTitle,
      });
    }
    this.handleCreateExpandableProperty(props);
  }

  protected handleCreateExpandableProperty(
    ...[
      {
        rawTitle,
        typeInfo,
        annotations,
        createDescription,
        createExamples,
        createDefaultValue,
      },
    ]: RendererCreateExpandablePropertyArgs
  ) {
    let type;
    if (typeInfo) {
      type =
        " " +
        this.createCode(this.#computeSingleLineDisplayType(typeInfo), {
          variant: "raw",
          style: "inline",
          escape: "mdx",
          append: false,
        });
    }
    const renderedAnnotations = annotations.map((annotation) => {
      return this.createPill(annotation.variant, () => annotation.title);
    });
    this.createHeading(
      HEADINGS.PROPERTY_HEADING_LEVEL,
      `${rawTitle} ${renderedAnnotations.join(" ")}${type}`,
      { id: this.getCurrentId(), escape: "mdx" }
    );
    createDescription?.();
    createExamples?.();
    createDefaultValue?.();
  }

  public override createFrontMatterDisplayType(
    ...[{ typeInfo }]: RendererCreateFrontMatterDisplayTypeArgs
  ) {
    this.createCode(this.#computeSingleLineDisplayType(typeInfo), {
      variant: "raw",
      style: "inline",
      escape: "mdx",
    });
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
      line += ` {#${id}}`;
    }
    if (append) {
      this.appendLine(line);
    }
    return line;
  }

  public override createText(
    ...[text, { escape = "mdx", append = true } = {}]: RendererCreateTextArgs
  ) {
    const escapedText = escapeText(text, { escape });
    if (append) {
      this.appendLine(escapedText);
    }
    return escapedText;
  }

  public override createCode(...[text, options]: RendererCreateCodeArgs) {
    let line: string;
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        line = `<code>${text}</code>`;
      } else {
        line = `<pre>
<code>
${text}\n</code>\n</pre>`;
      }
    } else {
      if (options?.style === "inline") {
        line = `\`${text}\``;
      } else {
        line = `\`\`\`${options?.language ?? ""}\n${text}\n\`\`\``;
      }
    }
    if (options?.append) {
      this.appendLine(line);
    }
    return line;
  }

  public override createList(
    ...[
      items,
      { escape = "markdown", append = true } = {},
    ]: RendererCreateListArgs
  ) {
    const list = items
      .map((item) => "- " + escapeText(item, { escape }))
      .join("\n");
    if (append) {
      this.appendLine(list);
    }
    return list;
  }

  public override createPill(
    // We don't use variant in the basic Markdown version
    ...[_variant, cb, { append = false } = {}]: RendererCreatePillArgs
  ) {
    const line = `(${cb()})`;
    if (append) {
      this.appendLine(line);
    }
    return line;
  }

  // TODO: need to make other overrides explicitly define return type like we do
  // here, since overridding doesn't infer type from parent
  public override createSection(...[cb]: RendererCreateSectionArgs): void {
    cb();
  }

  public override createSectionTitle(...[cb]: RendererCreateSectionTitleArgs) {
    cb();
  }

  public override createSectionContent(
    ...[cb]: RendererCreateSectionContentArgs
  ) {
    cb();
  }

  protected createTabbedSection(...[cb]: RendererCreateTabbedSectionArgs) {
    cb();
  }

  protected createTabbedSectionTab(
    ...[cb]: RendererCreateTabbedSectionTabArgs
  ) {
    cb();
  }

  #computeSingleLineDisplayType = (typeInfo: DisplayTypeInfo): string => {
    switch (typeInfo.label) {
      case "array":
      case "map":
      case "set": {
        const children = typeInfo.children.map(
          this.#computeSingleLineDisplayType
        );
        return `${typeInfo.label}&lt;${children.join(",")}&gt;`;
      }
      case "union":
      case "enum": {
        const children = typeInfo.children.map(
          this.#computeSingleLineDisplayType
        );
        return children.join(" | ");
      }
      default: {
        return typeInfo.linkedLabel;
      }
    }
  };

  public override createDebugPlaceholder(
    ...[{ createTitle, createExample }]: RendererCreateDebugPlaceholderArgs
  ) {
    createTitle();
    this.createText("_OpenAPI example:_");
    createExample();
  }

  public override enterContext(...[context]: RendererCreateContextArgs) {
    this.#contextStack.push(context);
  }

  public override exitContext() {
    this.#contextStack.pop();
  }

  public override getCurrentId(...[postFixId]: RendererGetCurrentIdArgs) {
    const ids = this.#contextStack.map((context) => context.id);
    if (postFixId) {
      ids.push(postFixId);
    }
    return ids.join(this.getIdSeparator()).toLowerCase();
  }

  protected getIdSeparator() {
    return "+";
  }

  protected getContextStack() {
    return this.#contextStack;
  }

  public override getCurrentContextType() {
    const topLevelContext = this.#contextStack.at(-1);
    if (!topLevelContext) {
      throw new InternalError("No context found");
    }
    return topLevelContext.type;
  }

  public override hasParentContextType(
    ...[type]: RendererHasParentContextTypeArgs
  ) {
    return this.#contextStack.some((context) => context.type === type);
  }

  public override getSchemaDepth() {
    return this.#contextStack.filter((context) => context.type === "schema")
      .length;
  }

  public override alreadyInContext(...[id]: RendererAlreadyInContextArgs) {
    return this.#contextStack.some((context) => context.id === id);
  }

  public override getDocsData() {
    return this.#docsData;
  }

  protected appendLine(line: string | null) {
    // We check to make sure we have a value, because some renderers don't need
    // to do anything for certain operations. They signal this by returning null
    if (line) {
      this.#rendererLines.push(line);
    }
  }

  public override render() {
    if (this.#isFinalized) {
      throw new InternalError("Renderer has already been finalized");
    }
    const contents = this.#rendererLines.join("\n\n");
    this.#isFinalized = true;
    return { contents, metadata: this.#pageMetadata };
  }
}
