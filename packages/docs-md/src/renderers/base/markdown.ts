import { join, resolve } from "node:path";

import { InternalError } from "../../util/internalError.ts";
import { getSettings } from "../../util/settings.ts";
import type {
  RendererAppendCodeBlockArgs,
  RendererAppendHeadingArgs,
  RendererAppendListArgs,
  RendererAppendSidebarLinkArgs,
  RendererAppendTextArgs,
  RendererAppendTryItNowArgs,
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

  public hasPage(...[path]: SiteHasPageArgs): boolean {
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

  public appendHeading(
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
    this[rendererLines].push(line);
  }

  public appendText(
    ...[text, { escape = "mdx" } = {}]: RendererAppendTextArgs
  ) {
    this[rendererLines].push(this.escapeText(text, { escape }));
  }

  public appendCodeBlock(...[text, options]: RendererAppendCodeBlockArgs) {
    if (options?.variant === "raw") {
      this[rendererLines].push(`<pre>
<code>
${text}
</code>
</pre>`);
    } else {
      this[rendererLines].push(
        `\`\`\`${options?.language ?? ""}\n${text}\n\`\`\``
      );
    }
  }

  public appendList(
    ...[items, { escape = "markdown" } = {}]: RendererAppendListArgs
  ) {
    this[rendererLines].push(
      items.map((item) => "- " + this.escapeText(item, { escape })).join("\n")
    );
  }

  public appendExpandableSectionStart(
    ...[
      title,
      { isOpenOnLoad = false, escape = "markdown" } = {},
    ]: RendererBeginExpandableSectionArgs
  ) {
    this[rendererLines].push(`<details ${isOpenOnLoad ? "open" : ""}>`);
    this[rendererLines].push(
      `<summary>${this.escapeText(title, { escape })}</summary>`
    );
  }

  public appendExpandableSectionEnd() {
    this[rendererLines].push("</details>");
  }

  public appendSidebarLink(
    ..._: RendererAppendSidebarLinkArgs
  ): Renderer | undefined {
    throw new Error("This renderer does not support sidebar links");
  }

  public appendTryItNow(..._: RendererAppendTryItNowArgs): void {
    throw new Error("This renderer does not support try it now");
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
