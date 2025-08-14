import { join, resolve } from "node:path";

import { snakeCase } from "change-case";

import type { Chunk } from "../../../types/chunk.ts";
import type {
  DisplayTypeInfo,
  PageMetadata,
  PageMetadataOperation,
  PageMetadataSection,
  PropertyAnnotations,
} from "../../../types/shared.ts";
import { InternalError } from "../../../util/internalError.ts";
import { getSettings } from "../.././settings.ts";
import { HEADINGS } from "../../content/constants.ts";
import type {
  Context,
  RendererAlreadyInContextArgs,
  RendererConstructorArgs,
  RendererCreateCodeArgs,
  RendererCreateContextArgs,
  RendererCreateDebugPlaceholderArgs,
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
  RendererCreateTabbedSectionTabArgs,
  RendererCreateTextArgs,
  RendererEscapeTextArgs,
  RendererGetCurrentIdArgs,
  SiteBuildPagePathArgs,
  SiteCreatePageArgs,
  SiteHasPageArgs,
} from "./base.ts";
import { Renderer } from "./base.ts";
import { Site } from "./base.ts";

export abstract class MarkdownSite extends Site {
  #pages = new Map<string, Renderer>();
  #docsData: Map<string, Chunk> | undefined;
  #pageMetadata: PageMetadata[] = [];

  public setDocsData(docsData: Map<string, Chunk>): void {
    this.#docsData = docsData;
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

  public hasPage(...[path]: SiteHasPageArgs) {
    return this.#pages.has(path);
  }

  public createPage(...[path, slug, frontMatter]: SiteCreatePageArgs) {
    if (!this.#docsData) {
      throw new InternalError("Docs data not set");
    }
    const renderer = this.getRenderer({
      currentPageSlug: slug,
      currentPagePath: path,
      site: this,
      docsData: this.#docsData,
      frontMatter,
    });
    this.#pages.set(path, renderer);
    return renderer;
  }

  public render() {
    const pages: Record<string, string> = {};
    for (const [path, renderer] of this.#pages) {
      const { contents, metadata } = renderer.render();
      pages[path] = contents;
      if (metadata) {
        this.#pageMetadata.push(metadata);
      }
    }
    this.processPageMetadata(this.#pageMetadata);
    return pages;
  }

  public processPageMetadata(_pageMetadata: PageMetadata[]) {
    // Do nothing
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

  #rendererLines: string[] = [];

  constructor({
    docsData,
    site,
    currentPageSlug,
    frontMatter,
  }: RendererConstructorArgs) {
    super();
    this.#docsData = docsData;
    this.#site = site;
    if (currentPageSlug && frontMatter) {
      this.#pageMetadata = {
        sidebarPosition: frontMatter.sidebarPosition,
        sidebarLabel: frontMatter.sidebarLabel,
        slug: currentPageSlug,
        operations: [],
      };
    }
  }

  protected getSite() {
    return this.#site;
  }

  public override escapeText(...[text, { escape }]: RendererEscapeTextArgs) {
    switch (escape) {
      case "markdown":
        return (
          text
            .replaceAll("\\", "\\\\")
            .replaceAll("`", "\\`")
            .replaceAll("*", "\\*")
            .replaceAll("_", "\\_")
            .replaceAll("{", "\\{")
            .replaceAll("}", "\\}")
            .replaceAll("[", "\\[")
            .replaceAll("]", "\\]")
            .replaceAll("<", "\\<")
            .replaceAll(">", "\\>")
            .replaceAll("(", "\\(")
            .replaceAll(")", "\\)")
            .replaceAll("#", "\\#")
            .replaceAll("+", "\\+")
            // .replace("-", "\\-")
            // .replace(".", "\\.")
            .replaceAll("!", "\\!")
            .replaceAll("|", "\\|")
        );
      case "mdx":
        return text.replaceAll("{", "\\{").replaceAll("}", "\\}");
      case "html":
        return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
      case "none":
        return text;
    }
  }

  public override createOperationSection(
    ...[
      { method, path, operationId, summary, description },
      cb,
    ]: RendererCreateOperationArgs
  ): void {
    const { showDebugPlaceholders } = getSettings().display;
    const id = `operation-${snakeCase(operationId)}`;
    this.enterContext({ id, type: "operation" });

    if (this.#pageMetadata) {
      const currentOperation = {
        fragment: id,
        method,
        path,
      };
      this.#currentOperation = currentOperation;
      this.#pageMetadata.operations.push(currentOperation);
    }

    this.handleCreateOperationFrontmatter(() => {
      path = this.escapeText(path, {
        escape: "markdown",
      });
      this.createHeading(
        HEADINGS.SECTION_TITLE_HEADING_LEVEL,
        `${this.createPill("primary", () => `<b>${method.toUpperCase()}</b>`)} ${path}`,
        { id, escape: "none" }
      );
      if (summary && description) {
        this.createText(`_${summary}_`);
        this.createText(description);
      } else if (summary) {
        this.createText(summary);
        if (showDebugPlaceholders) {
          this.createDebugPlaceholder(() => "No description provided");
        }
      } else if (description) {
        this.createText(description);
        if (showDebugPlaceholders) {
          this.createDebugPlaceholder(() => "No summary provided");
        }
      } else if (showDebugPlaceholders) {
        this.createDebugPlaceholder(() => "No summary provided");
        this.createDebugPlaceholder(() => "No description provided");
      }
    });
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
    this.createSection(
      () => {
        this.createSectionTitle(
          () =>
            this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
              id: this.getCurrentId(),
            }),
          { variant: "top-level" }
        );
        this.createSectionContent(cb, { variant: "top-level" });
      },
      { variant: "top-level" }
    );
  }

  public override createSecuritySection(
    ...[cb]: RendererCreateSecuritySectionArgs
  ): void {
    this.enterContext({ id: "security", type: "section" });
    if (this.#currentOperation) {
      this.#currentSection = {
        fragment: this.getCurrentId(),
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

  protected handleCreateOperationFrontmatter(cb: () => void) {
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
        fragment: this.getCurrentId(),
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
      { isOptional, createFrontMatter, createBreakouts },
    ]: RendererCreateRequestSectionArgs
  ): void {
    this.enterContext({ id: "request", type: "section" });
    if (this.#currentOperation) {
      this.#currentSection = {
        fragment: this.getCurrentId(),
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
        this.handleCreateFrontMatter(createFrontMatter);
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
    this.appendTabbedSectionStart();
    this.createSectionTitle(
      () =>
        this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
          id: this.getCurrentId(),
        }),
      { variant: "default" }
    );
    cb(({ statusCode, contentType, createFrontMatter, createBreakouts }) => {
      this.enterContext({ id: statusCode, type: "section" });
      this.enterContext({ id: contentType.replace("/", "-"), type: "section" });
      if (this.#currentOperation?.responses) {
        this.#currentSection = {
          fragment: this.getCurrentId(),
          properties: [],
        };
        this.#currentOperation.responses[`${statusCode}-${contentType}`] =
          this.#currentSection;
      }

      this.appendTabbedSectionTabStart(this.getCurrentId());
      this.createText(statusCode);
      this.appendTabbedSectionTabEnd();
      this.createSectionContent(
        () => {
          this.handleCreateFrontMatter(createFrontMatter);
          this.handleCreateBreakouts(createBreakouts);
        },
        {
          id: this.getCurrentId(),
          variant: "top-level",
        }
      );

      this.#currentSection = undefined;
      this.exitContext();
      this.exitContext();
    });
    this.appendTabbedSectionEnd();
    this.exitContext();
  }

  protected handleCreateFrontMatter(cb: () => void) {
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
        fragment: this.getCurrentId(),
        name: props.title,
      });
    }
    this.handleCreateExpandableBreakout(props);
  }

  protected handleCreateExpandableBreakout(
    ...[{ createTitle, createContent }]: RendererCreateExpandableBreakoutArgs
  ) {
    createTitle();
    createContent?.();
  }

  public override createExpandableProperty(
    ...[props]: RendererCreateExpandablePropertyArgs
  ) {
    if (this.#currentSection && props.isTopLevel) {
      this.#currentSection.properties.push({
        fragment: this.getCurrentId(),
        name: props.title,
      });
    }
    this.handleCreateExpandableProperty(props);
  }

  protected handleCreateExpandableProperty(
    ...[
      { typeInfo, annotations, title, createContent },
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
      `${title} ${renderedAnnotations.join(" ")}${type}`,
      { id: this.getCurrentId(), escape: "mdx" }
    );
    createContent?.();
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
    let line = `${`#`.repeat(level)} ${this.escapeText(text, { escape })}`;
    if (id) {
      line += ` \\{#${id}\\}`;
    }
    if (append) {
      this.appendLine(line);
    }
    return line;
  }

  public override createText(
    ...[text, { escape = "mdx", append = true } = {}]: RendererCreateTextArgs
  ) {
    const escapedText = this.escapeText(text, { escape });
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
      .map((item) => "- " + this.escapeText(item, { escape }))
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

  protected createTabbedSectionStart() {
    return "";
  }

  protected appendTabbedSectionStart() {
    this.appendLine(this.createTabbedSectionStart());
  }

  protected createTabbedSectionEnd() {
    return "";
  }

  protected appendTabbedSectionEnd() {
    this.appendLine(this.createTabbedSectionEnd());
  }

  protected createTabbedSectionTabStart(
    ..._args: RendererCreateTabbedSectionTabArgs
  ) {
    return "";
  }

  protected appendTabbedSectionTabStart(
    ...args: RendererCreateTabbedSectionTabArgs
  ) {
    this.appendLine(this.createTabbedSectionTabStart(...args));
  }

  protected createTabbedSectionTabEnd() {
    return "";
  }

  protected appendTabbedSectionTabEnd() {
    this.appendLine(this.createTabbedSectionTabEnd());
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
    ...[cb]: RendererCreateDebugPlaceholderArgs
  ) {
    this.appendLine(cb());
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
