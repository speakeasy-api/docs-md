import { join, resolve } from "node:path";

import { snakeCase } from "change-case";

import { HEADINGS } from "../../pages/content/constants.ts";
import { InternalError } from "../../util/internalError.ts";
import { getSettings } from "../../util/settings.ts";
import type {
  DisplayTypeInfo,
  PropertyAnnotations,
  RendererAddOperationArgs,
  RendererAddParametersSectionArgs,
  RendererAddRequestSectionArgs,
  RendererAddResponsesArgs,
  RendererAddSecuritySectionArgs,
  RendererAddTopLevelSectionArgs,
  RendererAppendHeadingArgs,
  RendererCreateAppendCodeArgs,
  RendererCreateAppendTextArgs,
  RendererCreateListArgs,
  RendererCreatePillArgs,
  RendererCreatePropertyArgs,
  RendererCreateSectionArgs,
  RendererCreateSectionContentArgs,
  RendererCreateSectionTitleArgs,
  RendererCreateTabbedSectionTabArgs,
  RendererEscapeTextArgs,
  SiteBuildPagePathArgs,
  SiteCreatePageArgs,
  SiteHasPageArgs,
} from "./base.ts";
import { Renderer } from "./base.ts";
import { Site } from "./base.ts";

export abstract class MarkdownSite extends Site {
  #pages = new Map<string, Renderer>();

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
    const renderer = this.getRenderer({
      currentPagePath: path,
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

export const rendererLines = Symbol();

export abstract class MarkdownRenderer extends Renderer {
  #isFinalized = false;
  #idStack: string[] = [];

  [rendererLines]: string[] = [];

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

  public override addOperationSection(
    ...[
      { method, path, operationId, summary, description },
      cb,
    ]: RendererAddOperationArgs
  ): void {
    const { showDebugPlaceholders } = getSettings().display;
    const id = `operation-${snakeCase(operationId)}`;
    this.#idStack.push(id);
    const methodStart = this.createPillStart("primary");
    const methodEnd = this.createPillEnd();
    path = this.escapeText(path, {
      escape: "markdown",
    });
    this.appendHeading(
      HEADINGS.SECTION_TITLE_HEADING_LEVEL,
      `${methodStart}<b>${method.toUpperCase()}</b>${methodEnd} ${path}`,
      { id, escape: "none" }
    );
    if (summary && description) {
      this.appendText(`_${summary}_`);
      this.appendText(description);
    } else if (summary) {
      this.appendText(summary);
      if (showDebugPlaceholders) {
        this.appendDebugPlaceholderStart();
        this.appendText("No description provided");
        this.appendDebugPlaceholderEnd();
      }
    } else if (description) {
      this.appendText(description);
      if (showDebugPlaceholders) {
        this.appendDebugPlaceholderStart();
        this.appendText("No summary provided");
        this.appendDebugPlaceholderEnd();
      }
    } else if (showDebugPlaceholders) {
      this.appendDebugPlaceholderStart();
      this.appendText("No summary provided");
      this.appendDebugPlaceholderEnd();
      this.appendDebugPlaceholderStart();
      this.appendText("No description provided");
      this.appendDebugPlaceholderEnd();
    }
    cb(this);
    this.#idStack.pop();
  }

  #addTopLevelSection(
    ...[{ title, annotations = [] }, cb]: RendererAddTopLevelSectionArgs
  ): void {
    for (const annotation of annotations) {
      title += ` ${this.createPillStart(annotation.variant)}${annotation.title}${this.createPillEnd()}`;
    }
    this.appendSectionStart({ variant: "top-level" });
    this.appendSectionTitleStart({ variant: "top-level" });
    this.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, title, {
      id: this.getIdPrefix(),
    });
    this.appendSectionTitleEnd();
    this.appendSectionContentStart({ variant: "top-level" });
    cb(this);
    this.appendSectionContentEnd();
    this.appendSectionEnd();
  }

  public override addSecuritySection(
    ...[cb]: RendererAddSecuritySectionArgs
  ): void {
    this.#idStack.push("security");
    this.#addTopLevelSection({ title: "Security" }, cb);
    this.#idStack.pop();
  }

  public override addParametersSection(
    ...[cb]: RendererAddParametersSectionArgs
  ): void {
    this.#idStack.push("parameters");
    this.#addTopLevelSection({ title: "Parameters" }, (parameterRenderer) => {
      cb(({ name, isRequired }, cb) => {
        const start = parameterRenderer.createPillStart("warning");
        const end = parameterRenderer.createPillEnd();
        parameterRenderer.appendHeading(
          HEADINGS.PROPERTY_HEADING_LEVEL,
          `${parameterRenderer.escapeText(name, { escape: "markdown" })}${isRequired ? ` ${start}required${end}` : ""}`,
          {
            id: this.getIdPrefix(),
            escape: "none",
          }
        );

        // TODO: return a parmeter specific callback, not a generic renderer,
        // so that we get proper heading IDs
        cb({ parameterRenderer });
      });
    });
    this.#idStack.pop();
  }

  public override addRequestSection(
    ...[{ isOptional, site, data }, cb]: RendererAddRequestSectionArgs
  ): void {
    this.#idStack.push("request");
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
      (schemaRenderer) => {
        cb({
          site,
          renderer: schemaRenderer,
          schemaStack: [],
          idPrefix: this.getIdPrefix(),
          data,
        });
      }
    );
    this.#idStack.pop();
  }

  public override addResponsesSection(...[cb]: RendererAddResponsesArgs): void {
    this.#idStack.push("responses");
    this.appendTabbedSectionStart();
    this.appendSectionTitleStart({ variant: "default" });
    this.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, "Responses", {
      id: this.getIdPrefix(),
    });
    this.appendSectionTitleEnd();
    cb(({ statusCode, contentType, site, data }, cb) => {
      this.#idStack.push(statusCode, contentType.replace("/", "-"));
      this.appendTabbedSectionTabStart(this.getIdPrefix());
      this.appendText(statusCode);
      this.appendTabbedSectionTabEnd();
      this.appendSectionContentStart({
        id: this.getIdPrefix(),
        variant: "top-level",
      });
      const context = {
        site,
        renderer: this,
        schemaStack: [],
        idPrefix: this.getIdPrefix(),
        data,
      };
      cb(context);
      this.appendSectionContentEnd();
      this.#idStack.pop();
    });
    this.appendTabbedSectionEnd();
    this.#idStack.pop();
  }

  protected getIdPrefix(): string {
    // TODO: make this per-renderer configurable
    return this.#idStack.join("+");
  }

  public override createHeading(
    ...[
      level,
      text,
      { escape = "markdown", id } = {},
    ]: RendererAppendHeadingArgs
  ) {
    let line = `${`#`.repeat(level)} ${this.escapeText(text, { escape })}`;
    if (id) {
      line += ` \\{#${id}\\}`;
    }
    return line;
  }

  public override appendHeading(...args: RendererAppendHeadingArgs) {
    this[rendererLines].push(this.createHeading(...args));
  }

  public override createText(
    ...[text, { escape = "mdx" } = {}]: RendererCreateAppendTextArgs
  ) {
    return this.escapeText(text, { escape });
  }

  public override appendText(...args: RendererCreateAppendTextArgs) {
    this[rendererLines].push(this.createText(...args));
  }

  public override createCode(...[text, options]: RendererCreateAppendCodeArgs) {
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        return `<code>${text}</code>`;
      }
      return `<pre>
<code>
${text}\n</code>\n</pre>`;
    } else {
      if (options?.style === "inline") {
        return `\`${text}\``;
      }
      return `\`\`\`${options?.language ?? ""}\n${text}\n\`\`\``;
    }
  }

  public override appendCode(...args: RendererCreateAppendCodeArgs) {
    this[rendererLines].push(this.createCode(...args));
  }

  public override createList(
    ...[items, { escape = "markdown" } = {}]: RendererCreateListArgs
  ) {
    return items
      .map((item) => "- " + this.escapeText(item, { escape }))
      .join("\n");
  }

  public override appendList(...args: RendererCreateListArgs) {
    this[rendererLines].push(this.createList(...args));
  }

  public override createPillStart(..._args: RendererCreatePillArgs) {
    return "(";
  }

  public override appendPillStart(...args: RendererCreatePillArgs) {
    this[rendererLines].push(this.createPillStart(...args));
  }

  public override createPillEnd() {
    return ")";
  }

  public override appendPillEnd() {
    this[rendererLines].push(this.createPillEnd());
  }

  public override createSectionStart(
    ..._args: RendererCreateSectionArgs
  ): string {
    return "";
  }

  public override appendSectionStart(...args: RendererCreateSectionArgs): void {
    this[rendererLines].push(this.createSectionStart(...args));
  }

  public override createSectionEnd(): string {
    return "";
  }

  public override appendSectionEnd(): void {
    this[rendererLines].push(this.createSectionEnd());
  }

  public override createSectionTitleStart(
    ..._args: RendererCreateSectionTitleArgs
  ): string {
    return "";
  }

  public override appendSectionTitleStart(
    ...args: RendererCreateSectionTitleArgs
  ): void {
    this[rendererLines].push(this.createSectionTitleStart(...args));
  }

  public override createSectionTitleEnd(): string {
    return "";
  }

  public override appendSectionTitleEnd(): void {
    this[rendererLines].push(this.createSectionTitleEnd());
  }

  public override createSectionContentStart(
    ..._args: RendererCreateSectionContentArgs
  ): string {
    return "";
  }

  public override appendSectionContentStart(
    ...args: RendererCreateSectionContentArgs
  ): void {
    this[rendererLines].push(this.createSectionContentStart(...args));
  }

  public override createSectionContentEnd(): string {
    return "";
  }

  public override appendSectionContentEnd(): void {
    this[rendererLines].push(this.createSectionContentEnd());
  }

  public override createExpandableSectionStart() {
    return "";
  }

  public override appendExpandableSectionStart() {
    this[rendererLines].push(this.createExpandableSectionStart());
  }

  public override createExpandableSectionEnd(): string {
    return "";
  }

  public override appendExpandableSectionEnd(): void {
    this[rendererLines].push(this.createExpandableSectionEnd());
  }

  public override createTabbedSectionStart(): string {
    return "";
  }

  public override appendTabbedSectionStart(): void {
    this[rendererLines].push(this.createTabbedSectionStart());
  }

  public override createTabbedSectionEnd(): string {
    return "";
  }

  public override appendTabbedSectionEnd(): void {
    this[rendererLines].push(this.createTabbedSectionEnd());
  }

  public override createTabbedSectionTabStart(
    ..._args: RendererCreateTabbedSectionTabArgs
  ): string {
    return "";
  }

  public override appendTabbedSectionTabStart(
    ...args: RendererCreateTabbedSectionTabArgs
  ): void {
    this[rendererLines].push(this.createTabbedSectionTabStart(...args));
  }

  public override createTabbedSectionTabEnd(): string {
    return "";
  }

  public override appendTabbedSectionTabEnd(): void {
    this[rendererLines].push(this.createTabbedSectionTabEnd());
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

  public override createProperty(
    ...[{ typeInfo, id, annotations, title }]: RendererCreatePropertyArgs
  ) {
    const type = this.createCode(this.#computeSingleLineDisplayType(typeInfo), {
      variant: "raw",
      style: "inline",
      escape: "mdx",
    });
    const renderedAnnotations = annotations.map((annotation) => {
      const start = this.createPillStart(annotation.variant);
      const end = this.createPillEnd();
      return `${start}${annotation.title}${end}`;
    });
    return this.createHeading(
      HEADINGS.PROPERTY_HEADING_LEVEL,
      `${title} ${renderedAnnotations.join(" ")} ${type}`,
      { id, escape: "mdx" }
    );
  }

  public override appendProperty(...args: RendererCreatePropertyArgs): void {
    this[rendererLines].push(this.createProperty(...args));
  }

  public override createDebugPlaceholderStart(): string {
    return "";
  }

  public override appendDebugPlaceholderStart(): void {
    this[rendererLines].push(this.createDebugPlaceholderStart());
  }

  public override createDebugPlaceholderEnd(): string {
    return "";
  }

  public override appendDebugPlaceholderEnd(): void {
    this[rendererLines].push(this.createDebugPlaceholderEnd());
  }

  public override render() {
    if (this.#isFinalized) {
      throw new InternalError("Renderer has already been finalized");
    }
    const data = this[rendererLines].join("\n\n");
    this.#isFinalized = true;
    return data;
  }
}
