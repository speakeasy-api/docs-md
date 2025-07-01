import { join, resolve } from "node:path";

import { InternalError } from "../../util/internalError.ts";
import { getSettings } from "../../util/settings.ts";
import type {
  RendererAppendCodeArgs,
  RendererAppendHeadingArgs,
  RendererAppendListArgs,
  RendererAppendTextArgs,
  RendererBeginExpandableSectionArgs,
  RendererEscapeTextArgs,
} from "./renderer.ts";
import { Renderer } from "./renderer.ts";
import {
  Site,
  type SiteBuildPagePathArgs,
  type SiteCreatePageArgs,
  type SiteHasPageArgs,
} from "./site.ts";

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

  public escapeText(...[text, { escape }]: RendererEscapeTextArgs) {
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

  public createHeading(
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

  public appendHeading(...args: RendererAppendHeadingArgs) {
    this[rendererLines].push(this.createHeading(...args));
  }

  public createText(
    ...[text, { escape = "mdx" } = {}]: RendererAppendTextArgs
  ) {
    return this.escapeText(text, { escape });
  }

  public appendText(...args: RendererAppendTextArgs) {
    this[rendererLines].push(this.createText(...args));
  }

  public createCode(...[text, options]: RendererAppendCodeArgs) {
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

  public appendCode(...args: RendererAppendCodeArgs) {
    this[rendererLines].push(this.createCode(...args));
  }

  public createList(
    ...[items, { escape = "markdown" } = {}]: RendererAppendListArgs
  ) {
    return items
      .map((item) => "- " + this.escapeText(item, { escape }))
      .join("\n");
  }

  public appendList(...args: RendererAppendListArgs) {
    this[rendererLines].push(this.createList(...args));
  }

  public createExpandableSectionStart(
    ...[
      title,
      { isOpenOnLoad = false, escape = "markdown" } = {},
    ]: RendererBeginExpandableSectionArgs
  ) {
    return `<details ${isOpenOnLoad ? "open" : ""}>\n\n<summary>${this.escapeText(title, { escape })}</summary>`;
  }

  public appendExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ) {
    this[rendererLines].push(this.createExpandableSectionStart(...args));
  }

  public createExpandableSectionEnd() {
    return "</details>";
  }

  public appendExpandableSectionEnd() {
    this[rendererLines].push(this.createExpandableSectionEnd());
  }

  public render() {
    if (this.#isFinalized) {
      throw new InternalError("Renderer has already been finalized");
    }
    const data = this[rendererLines].join("\n\n");
    this.#isFinalized = true;
    return data;
  }
}
