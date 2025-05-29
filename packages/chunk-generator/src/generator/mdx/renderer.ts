import { dirname, join, relative } from "node:path";

type AppendOptions = {
  // We almost always want to escape special Markdown characters, so we default
  // to true. However, sometimes content coming in is actually in Markdown, so
  // we want to preserve this Markdown formatting by setting this to false
  escape?: boolean;
};

export class Renderer {
  #baseComponentPath: string;
  #currentPagePath: string;
  #frontMatter: string | undefined;
  #imports = new Map<string, Set<string>>();
  #lines: string[] = [];

  constructor({
    baseComponentPath,
    currentPagePath,
  }: {
    baseComponentPath: string;
    currentPagePath: string;
  }) {
    this.#baseComponentPath = baseComponentPath;
    this.#currentPagePath = currentPagePath;
  }

  public escapeText(text: string) {
    return (
      text
        .replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("*", "\\*")
        .replace("_", "\\_")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("[", "\\[")
        .replace("]", "\\]")
        .replace("<", "\\<")
        .replace(">", "\\>")
        .replace("(", "\\(")
        .replace(")", "\\)")
        .replace("#", "\\#")
        .replace("+", "\\+")
        // .replace("-", "\\-")
        // .replace(".", "\\.")
        .replace("!", "\\!")
        .replace("|", "\\|")
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

  public render() {
    let imports = "";
    for (const [importPath, symbols] of this.#imports) {
      imports += `import { ${Array.from(symbols).join(", ")} } from "${importPath}";\n`;
    }
    const data =
      this.#frontMatter + "\n\n" + imports + "\n\n" + this.#lines.join("\n\n");
    this.#lines = [];
    return data;
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
