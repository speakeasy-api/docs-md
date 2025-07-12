import { join, resolve } from "node:path";

import { InternalError } from "../../util/internalError.ts";
import { getSettings } from "../../util/settings.ts";
import type {
  RendererAppendHeadingArgs,
  RendererCreateAppendCodeArgs,
  RendererCreateAppendTextArgs,
  RendererCreateExpandableSectionArgs,
  RendererCreateListArgs,
  RendererCreatePillArgs,
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

  public override createSectionStart(): string {
    return "";
  }

  public override appendSectionStart(): void {
    this[rendererLines].push(this.createSectionStart());
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

  public override createExpandableSectionStart(
    ...[title, { id, escape = "mdx" }]: RendererCreateExpandableSectionArgs
  ) {
    return `<details id="${id}">\n\n<summary>${this.escapeText(title, { escape })}</summary>`;
  }

  public override appendExpandableSectionStart(
    ...args: RendererCreateExpandableSectionArgs
  ) {
    this[rendererLines].push(this.createExpandableSectionStart(...args));
  }

  public override createExpandableSectionEnd(): string {
    return "</details>";
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

  public override render() {
    if (this.#isFinalized) {
      throw new InternalError("Renderer has already been finalized");
    }
    const data = this[rendererLines].join("\n\n");
    this.#isFinalized = true;
    return data;
  }
}
