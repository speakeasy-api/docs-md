import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ASSET_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "assets"
);

type AppendOptions = {
  // We almost always want to escape special Markdown characters, so we default
  // to true. However, sometimes content coming in is actually in Markdown, so
  // we want to preserve this Markdown formatting by setting this to false
  escape?: boolean;
};

const SAVE_PAGE = Symbol();

export class Site {
  #baseComponentPath: string;
  #pages = new Map<string, string>();

  constructor({ baseComponentPath }: { baseComponentPath: string }) {
    this.#baseComponentPath = baseComponentPath;

    // Prepopulate the list of static assets to be saved
    const assetFileList = readdirSync(ASSET_PATH, {
      recursive: true,
      withFileTypes: true,
    })
      .filter((f) => f.isFile())
      .map((f) => join(f.parentPath, f.name).replace(ASSET_PATH + "/", ""));
    for (const assetFile of assetFileList) {
      this.#pages.set(
        join(baseComponentPath, assetFile),
        readFileSync(join(ASSET_PATH, assetFile), "utf-8")
      );
    }
  }

  public createPage(path: string): Renderer {
    return new Renderer({
      site: this,
      baseComponentPath: this.#baseComponentPath,
      currentPagePath: path,
    });
  }

  public getPages() {
    return this.#pages;
  }

  private [SAVE_PAGE](path: string, content: string) {
    this.#pages.set(path, content);
  }
}

export class Renderer {
  #site: Site;
  #baseComponentPath: string;
  #currentPagePath: string;
  #frontMatter: string | undefined;
  #imports = new Map<string, Set<string>>();
  #lines: string[] = [];

  constructor({
    site,
    baseComponentPath,
    currentPagePath,
  }: {
    site: Site;
    baseComponentPath: string;
    currentPagePath: string;
  }) {
    this.#site = site;
    this.#baseComponentPath = baseComponentPath;
    this.#currentPagePath = currentPagePath;
  }

  // TODO: need to split this into tiers. For example, paragraphs should escape
  // {}, since they're MDX-specific extensions, but otherwise shouldn't escape
  // anything else
  public escapeText(text: string) {
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
  }

  public insertFrontMatter({
    sidebarPosition,
    sidebarLabel,
  }: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    this.#frontMatter = `---
sidebar_position: ${sidebarPosition}
sidebar_label: ${this.escapeText(sidebarLabel)}
---`;
  }

  public appendHeading(
    level: number,
    text: string,
    { escape = true }: AppendOptions = {}
  ) {
    this.#lines.push(
      `#`.repeat(level) + " " + (escape ? this.escapeText(text) : text)
    );
  }

  public appendParagraph(text: string, { escape = false }: AppendOptions = {}) {
    this.#lines.push(escape ? this.escapeText(text) : text);
  }

  public appendList(items: string[], { escape = true }: AppendOptions = {}) {
    this.#lines.push(
      items
        .map((item) => "- " + (escape ? this.escapeText(item) : item))
        .join("\n")
    );
  }

  public beginExpandableSection(
    title: string,
    {
      isOpenOnLoad = false,
      escape = true,
    }: { isOpenOnLoad?: boolean } & AppendOptions
  ) {
    this.#lines.push(`<details ${isOpenOnLoad ? "open" : ""}>`);
    this.#lines.push(
      `<summary>${escape ? this.escapeText(title) : title}</summary>`
    );
  }

  public endExpandableSection() {
    this.#lines.push("</details>");
  }

  public appendSidebarLink({
    content,
    title,
  }: {
    content: string;
    title: string;
  }) {
    this.#insertComponentImport("SideBar", "SideBar/index.tsx");
    this.#lines.push(
      `<p>
  <SideBar cta="${`View ${title}`}" title="${title}">
    ${content}
  </SideBar>
</p>`
    );
  }

  public finalize() {
    let imports = "";
    for (const [importPath, symbols] of this.#imports) {
      imports += `import { ${Array.from(symbols).join(", ")} } from "${importPath}";\n`;
    }
    const data =
      this.#frontMatter + "\n\n" + imports + "\n\n" + this.#lines.join("\n\n");
    this.#lines = [];
    this.#site[SAVE_PAGE](this.#currentPagePath, data);
  }

  #insertComponentImport(symbol: string, componentPath: string) {
    const importPath = relative(
      dirname(this.#currentPagePath),
      join(this.#baseComponentPath, componentPath)
    );
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, new Set());
    }
    this.#imports.get(importPath)?.add(symbol);
  }
}
