import { join, resolve } from "node:path";

import type { Renderer, RendererConstructor } from "../../types/renderer.ts";
import type { Site } from "../../types/site.ts";
import { getSettings } from "../../util/settings.ts";

type Escape = "all" | "mdx" | "none";

type AppendOptions = {
  // We almost always want to escape special Markdown characters, so we default
  // to true. However, sometimes content coming in is actually in Markdown, so
  // we want to preserve this Markdown formatting by setting this to false
  escape?: Escape;
};

export class MarkdownSite implements Site {
  #pages = new Map<string, Renderer>();
  #Renderer: RendererConstructor;

  constructor(Renderer: RendererConstructor) {
    this.#Renderer = Renderer;
  }

  public buildPagePath(slug: string): string {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}.md`));
  }

  public hasPage(path: string): boolean {
    return this.#pages.has(path);
  }

  public createPage(path: string): Renderer {
    // Reserve the name, since we sometimes check to see if pages already exist
    const renderer = new this.#Renderer({
      currentPagePath: path,
    });
    this.#pages.set(path, renderer);
    return renderer;
  }

  public createEmbedPage(_: string): Renderer | undefined {
    throw new Error("Not supported");
  }

  public createRawPage(path: string, contents: string) {
    const renderer = new this.#Renderer({
      currentPagePath: path,
    });
    renderer.appendRaw(contents);
    this.#pages.set(path, renderer);
  }

  public finalize() {
    const pages: Record<string, string> = {};
    for (const [path, renderer] of this.#pages) {
      pages[path] = renderer.finalize();
    }
    return pages;
  }
}

export const rendererLines = Symbol();

export class MarkdownRenderer implements Renderer {
  #isFinalized = false;
  [rendererLines]: string[] = [];

  // TODO: don't escape if they're already escaped
  public escapeText(text: string, { escape }: { escape: Escape }) {
    switch (escape) {
      case "all":
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
      case "none":
        return text;
    }
  }

  public insertFrontMatter(_: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    throw new Error("Not supported");
  }

  public appendHeading(
    level: number,
    text: string,
    { escape = "all" }: AppendOptions = {}
  ) {
    this.#checkFinalized();
    this[rendererLines].push(
      `#`.repeat(level) + " " + this.escapeText(text, { escape })
    );
  }

  public appendParagraph(text: string, { escape = "mdx" }: AppendOptions = {}) {
    this.#checkFinalized();
    this[rendererLines].push(this.escapeText(text, { escape }));
  }

  public appendCode(text: string) {
    this.#checkFinalized();
    this[rendererLines].push(`\`\`\`\n${text}\n\`\`\``);
  }

  public appendList(items: string[], { escape = "all" }: AppendOptions = {}) {
    this.#checkFinalized();
    this[rendererLines].push(
      items.map((item) => "- " + this.escapeText(item, { escape })).join("\n")
    );
  }

  public appendRaw(text: string) {
    this.#checkFinalized();
    this[rendererLines].push(text);
  }

  public beginExpandableSection(
    title: string,
    {
      isOpenOnLoad = false,
      escape = "all",
    }: { isOpenOnLoad?: boolean } & AppendOptions
  ) {
    this.#checkFinalized();
    this[rendererLines].push(`<details ${isOpenOnLoad ? "open" : ""}>`);
    this[rendererLines].push(
      `<summary>${this.escapeText(title, { escape })}</summary>`
    );
  }

  public endExpandableSection() {
    this.#checkFinalized();
    this[rendererLines].push("</details>");
  }

  public appendSidebarLink(_: { title: string; embedName: string }) {
    throw new Error("Not supported");
  }

  public appendTryItNow(_: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }) {
    throw new Error("Not supported");
  }

  public finalize() {
    const data = this[rendererLines].join("\n\n");
    this.#isFinalized = true;
    return data;
  }

  #checkFinalized() {
    if (this.#isFinalized) {
      throw new Error("Renderer has already been finalized");
    }
  }
}
