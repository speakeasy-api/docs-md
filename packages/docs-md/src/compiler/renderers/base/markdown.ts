import { join, resolve } from "node:path";

import { snakeCase } from "change-case";

import type { Chunk } from "../../../types/chunk.ts";
import type {
  DisplayTypeInfo,
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

  public createPage(...[path]: SiteCreatePageArgs) {
    if (!this.#docsData) {
      throw new InternalError("Docs data not set");
    }
    const renderer = this.getRenderer({
      currentPagePath: path,
      site: this,
      docsData: this.#docsData,
    });
    this.#pages.set(path, renderer);
    return renderer;
  }

  public render() {
    const pages: Record<string, string> = {};
    for (const [path, renderer] of this.#pages) {
      pages[path] = renderer.render();
    }
    return pages;
  }
}

export abstract class MarkdownRenderer extends Renderer {
  #isFinalized = false;
  #contextStack: Context[] = [];
  #docsData: Map<string, Chunk>;
  #site: Site;

  #rendererLines: string[] = [];

  constructor({ docsData, site }: RendererConstructorArgs) {
    super();
    this.#docsData = docsData;
    this.#site = site;
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
    const methodStart = this.createPillStart("primary");
    const methodEnd = this.createPillEnd();
    path = this.escapeText(path, {
      escape: "markdown",
    });
    this.createHeading(
      HEADINGS.SECTION_TITLE_HEADING_LEVEL,
      `${methodStart}<b>${method.toUpperCase()}</b>${methodEnd} ${path}`,
      { id, escape: "none" }
    );
    if (summary && description) {
      this.createText(`_${summary}_`);
      this.createText(description);
    } else if (summary) {
      this.createText(summary);
      if (showDebugPlaceholders) {
        this.appendDebugPlaceholderStart();
        this.createText("No description provided");
        this.appendDebugPlaceholderEnd();
      }
    } else if (description) {
      this.createText(description);
      if (showDebugPlaceholders) {
        this.appendDebugPlaceholderStart();
        this.createText("No summary provided");
        this.appendDebugPlaceholderEnd();
      }
    } else if (showDebugPlaceholders) {
      this.appendDebugPlaceholderStart();
      this.createText("No summary provided");
      this.appendDebugPlaceholderEnd();
      this.appendDebugPlaceholderStart();
      this.createText("No description provided");
      this.appendDebugPlaceholderEnd();
    }
    cb();
    this.exitContext();
  }

  #addTopLevelSection(
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
      title += ` ${this.createPillStart(annotation.variant)}${annotation.title}${this.createPillEnd()}`;
    }
    this.appendSectionStart({ variant: "top-level" });
    this.appendSectionTitleStart({ variant: "top-level" });
    this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
      id: this.getCurrentId(),
    });
    this.appendSectionTitleEnd();
    this.appendSectionContentStart({ variant: "top-level" });
    cb();
    this.appendSectionContentEnd();
    this.appendSectionEnd();
  }

  public override createSecuritySection(
    ...[cb]: RendererCreateSecuritySectionArgs
  ): void {
    this.enterContext({ id: "security", type: "section" });
    this.#addTopLevelSection({ title: "Security" }, () =>
      this.handleCreateSecurity(cb)
    );
    this.exitContext();
  }

  protected handleCreateSecurity(cb: () => void) {
    cb();
  }

  public override createParametersSection(
    ...[cb]: RendererCreateParametersSectionArgs
  ): void {
    this.enterContext({ id: "parameters", type: "section" });
    this.#addTopLevelSection({ title: "Parameters" }, () =>
      this.handleCreateParameters(cb)
    );
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
    const annotations: PropertyAnnotations[] = [];
    if (isOptional) {
      annotations.push({
        title: "Optional",
        variant: "info",
      });
    }
    this.#addTopLevelSection(
      {
        title: "Request Body",
        annotations,
      },
      () => {
        this.handleCreateFrontMatter(createFrontMatter);
        this.handleCreateBreakouts(createBreakouts);
      }
    );
    this.exitContext();
  }

  public override createResponsesSection(
    ...[cb, { title = "Responses" } = {}]: RendererCreateResponsesArgs
  ): void {
    this.enterContext({ id: "responses", type: "section" });
    this.appendTabbedSectionStart();
    this.appendSectionTitleStart({ variant: "default" });
    this.createHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
      id: this.getCurrentId(),
    });
    this.appendSectionTitleEnd();
    cb(({ statusCode, contentType, createFrontMatter, createBreakouts }) => {
      this.enterContext({ id: statusCode, type: "section" });
      this.enterContext({ id: contentType.replace("/", "-"), type: "section" });
      this.appendTabbedSectionTabStart(this.getCurrentId());
      this.createText(statusCode);
      this.appendTabbedSectionTabEnd();
      this.appendSectionContentStart({
        id: this.getCurrentId(),
        variant: "top-level",
      });
      this.handleCreateFrontMatter(createFrontMatter);
      this.handleCreateBreakouts(createBreakouts);
      this.appendSectionContentEnd();
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
    ...[{ createTitle, createContent }]: RendererCreateExpandableBreakoutArgs
  ) {
    createTitle();
    createContent?.();
  }

  public override createExpandableProperty(
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
      const start = this.createPillStart(annotation.variant);
      const end = this.createPillEnd();
      return `${start}${annotation.title}${end}`;
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
    ...[items, { escape = "markdown" } = {}]: RendererCreateListArgs
  ) {
    return items
      .map((item) => "- " + this.escapeText(item, { escape }))
      .join("\n");
  }

  public override appendList(...args: RendererCreateListArgs) {
    this.appendLine(this.createList(...args));
  }

  public override createPillStart(..._args: RendererCreatePillArgs) {
    return "(";
  }

  public override appendPillStart(...args: RendererCreatePillArgs) {
    this.appendLine(this.createPillStart(...args));
  }

  public override createPillEnd() {
    return ")";
  }

  public override appendPillEnd() {
    this.appendLine(this.createPillEnd());
  }

  public override createSectionStart(
    ..._args: RendererCreateSectionArgs
  ): string {
    return "";
  }

  public override appendSectionStart(...args: RendererCreateSectionArgs): void {
    this.appendLine(this.createSectionStart(...args));
  }

  public override createSectionEnd(): string {
    return "";
  }

  public override appendSectionEnd(): void {
    this.appendLine(this.createSectionEnd());
  }

  public override createSectionTitleStart(
    ..._args: RendererCreateSectionTitleArgs
  ) {
    return "";
  }

  public override appendSectionTitleStart(
    ...args: RendererCreateSectionTitleArgs
  ) {
    this.appendLine(this.createSectionTitleStart(...args));
  }

  public override createSectionTitleEnd() {
    return "";
  }

  public override appendSectionTitleEnd() {
    this.appendLine(this.createSectionTitleEnd());
  }

  public override createSectionContentStart(
    ..._args: RendererCreateSectionContentArgs
  ) {
    return "";
  }

  public override appendSectionContentStart(
    ...args: RendererCreateSectionContentArgs
  ) {
    this.appendLine(this.createSectionContentStart(...args));
  }

  public override createSectionContentEnd() {
    return "";
  }

  public override appendSectionContentEnd() {
    this.appendLine(this.createSectionContentEnd());
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

  public override createDebugPlaceholderStart() {
    return "";
  }

  public override appendDebugPlaceholderStart() {
    this.appendLine(this.createDebugPlaceholderStart());
  }

  public override createDebugPlaceholderEnd() {
    return "";
  }

  public override appendDebugPlaceholderEnd() {
    this.appendLine(this.createDebugPlaceholderEnd());
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
    const data = this.#rendererLines.join("\n\n");
    this.#isFinalized = true;
    return data;
  }
}
