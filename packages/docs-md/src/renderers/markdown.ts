import { join, resolve } from "node:path";

import type { AppendOptions, Escape, Renderer } from "../types/renderer.ts";
import type { Site } from "../types/site.ts";
import { InternalError } from "../util/internalError.ts";
import { getSettings } from "../util/settings.ts";

export class MarkdownSite implements Site {
  #pages = new Map<string, Renderer>();

  public buildPagePath(slug: string): string {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}.md`));
  }

  public hasPage(path: string): boolean {
    return this.#pages.has(path);
  }

  public createPage(path: string): Renderer {
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

  protected getRenderer(_options: { currentPagePath: string }): Renderer {
    throw new InternalError("getRenderer was not overridden");
  }
}

export const rendererLines = Symbol();

export class MarkdownRenderer implements Renderer {
  #isFinalized = false;
  [rendererLines]: string[] = [];

  // TODO: don't escape if they're already escaped
  public escapeText(text: string, { escape }: { escape: Escape }) {
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

  public insertFrontMatter(_: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    throw new Error("This renderer does not support front matter");
  }

  public appendHeading(
    level: number,
    text: string,
    { escape = "markdown" }: AppendOptions = {}
  ) {
    this[rendererLines].push(
      `#`.repeat(level) + " " + this.escapeText(text, { escape })
    );
  }

  public appendText(text: string, { escape = "mdx" }: AppendOptions = {}) {
    this[rendererLines].push(this.escapeText(text, { escape }));
  }

  public appendCodeBlock(
    text: string,
    options?:
      | {
          variant: "default";
          language?: string;
        }
      | {
          variant: "raw";
          language?: never;
        }
  ) {
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
    items: string[],
    { escape = "markdown" }: AppendOptions = {}
  ) {
    this[rendererLines].push(
      items.map((item) => "- " + this.escapeText(item, { escape })).join("\n")
    );
  }

  public appendRaw(text: string) {
    this[rendererLines].push(text);
  }

  public beginExpandableSection(
    title: string,
    {
      isOpenOnLoad = false,
      escape = "markdown",
    }: { isOpenOnLoad?: boolean } & AppendOptions
  ) {
    this[rendererLines].push(`<details ${isOpenOnLoad ? "open" : ""}>`);
    this[rendererLines].push(
      `<summary>${this.escapeText(title, { escape })}</summary>`
    );
  }

  public endExpandableSection() {
    this[rendererLines].push("</details>");
  }

  public appendSidebarLink(_: {
    title: string;
    embedName: string;
  }): Renderer | undefined {
    throw new Error("This renderer does not support sidebar links");
  }

  public appendTryItNow(_: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }) {
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
