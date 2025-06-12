import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { assertNever } from "../../util/assertNever.ts";
import { getSettings } from "../settings.ts";

const ASSET_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
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

function getEmbedPath(embedName: string) {
  return join(
    getSettings().output.componentOutDir,
    "embeds",
    embedName + ".mdx"
  );
}

function getEmbedSymbol(embedName: string) {
  return `Embed${embedName}`;
}

export class Site {
  #pages = new Map<string, string>();

  constructor() {
    // Prepopulate the list of static assets to be saved
    const assetFileList = readdirSync(ASSET_PATH, {
      recursive: true,
      withFileTypes: true,
    })
      .filter((f) => f.isFile())
      .map((f) => join(f.parentPath, f.name).replace(ASSET_PATH + "/", ""));
    for (const assetFile of assetFileList) {
      this.#pages.set(
        join(getSettings().output.componentOutDir, assetFile),
        readFileSync(join(ASSET_PATH, assetFile), "utf-8")
      );
    }
  }

  public createPage(path: string): Renderer {
    // Reserve the name, since we sometimes check to see if pages already exist
    this.#pages.set(path, "");
    return new Renderer({
      site: this,
      currentPagePath: path,
    });
  }

  public createEmbedPage(embedName: string): Renderer | undefined {
    const embedPath = getEmbedPath(embedName);
    if (this.#pages.has(embedPath)) {
      return;
    }
    return this.createPage(embedPath);
  }

  public createRawPage(path: string, contents: string) {
    this.#pages.set(path, contents);
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
  #currentPagePath: string;
  #frontMatter: string | undefined;
  #imports = new Map<
    string,
    { defaultAlias: string | undefined; namedImports: Set<string> }
  >();
  #includeSidebar = false;
  #lines: string[] = [];

  constructor({
    site,
    currentPagePath,
  }: {
    site: Site;
    currentPagePath: string;
  }) {
    this.#site = site;
    this.#currentPagePath = currentPagePath;
  }

  public escapeText(
    text: string,
    { mdxOnly = false }: { mdxOnly?: boolean } = {}
  ) {
    if (mdxOnly) {
      return text.replace(/(?<!\\)\{/g, "\\{").replace(/(?<!\\)\}/g, "\\}");
    }
    return text
      .replace(/(?<!\\)\\/g, "\\\\")
      .replace(/(?<!\\)`/g, "\\`")
      .replace(/(?<!\\)\*/g, "\\*")
      .replace(/(?<!\\)_/g, "\\_")
      .replace(/(?<!\\)\{/g, "\\{")
      .replace(/(?<!\\)\}/g, "\\}")
      .replace(/(?<!\\)\[/g, "\\[")
      .replace(/(?<!\\)\]/g, "\\]")
      .replace(/(?<!\\)</g, "\\<")
      .replace(/(?<!\\)>/g, "\\>")
      .replace(/(?<!\\)\(/g, "\\(")
      .replace(/(?<!\\)\)/g, "\\)")
      .replace(/(?<!\\)#/g, "\\#")
      .replace(/(?<!\\)\+/g, "\\+")
      .replace(/(?<!\\)!/g, "\\!")
      .replace(/(?<!\\)\|/g, "\\|");
  }

  public insertFrontMatter({
    sidebarPosition,
    sidebarLabel,
  }: {
    sidebarPosition: string;
    sidebarLabel: string;
  }) {
    const framework = getSettings().output.framework;
    switch (framework) {
      case "docusaurus": {
        this.#frontMatter = `---
sidebar_position: ${sidebarPosition}
sidebar_label: ${this.escapeText(sidebarLabel)}
---`;
        break;
      }
      case "nextra": {
        this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel)}
---`;
        break;
      }
      default: {
        assertNever(framework);
      }
    }
  }

  public appendHeading(
    level: number,
    text: string,
    { escape = true }: AppendOptions = {}
  ) {
    this.#lines.push(
      `#`.repeat(level) + " " + this.escapeText(text, { mdxOnly: !escape })
    );
  }

  public appendParagraph(text: string, { escape = false }: AppendOptions = {}) {
    this.#lines.push(this.escapeText(text, { mdxOnly: !escape }));
  }

  public appendCode(text: string) {
    this.#lines.push(`\`\`\`\n${text}\n\`\`\``);
  }

  public appendList(items: string[], { escape = true }: AppendOptions = {}) {
    this.#lines.push(
      items
        .map((item) => "- " + this.escapeText(item, { mdxOnly: !escape }))
        .join("\n")
    );
  }

  public appendRaw(text: string) {
    this.#lines.push(text);
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
      `<summary>${this.escapeText(title, { mdxOnly: !escape })}</summary>`
    );
  }

  public endExpandableSection() {
    this.#lines.push("</details>");
  }

  public appendSidebarLink({
    title,
    embedName,
  }: {
    title: string;
    embedName: string;
  }) {
    this.#includeSidebar = true;
    this.insertComponentImport("SideBarCta", "SideBar/index.tsx");
    this.insertComponentImport("SideBar", "SideBar/index.tsx");
    if (!this.#insertEmbedImport(embedName)) {
      console.error(`Direct circular import detected, skipping sidebar link`);
      return;
    }
    this.#lines.push(
      `<p>
  <SideBarCta cta="${`View ${this.escapeText(title, { mdxOnly: true })}`}" title="${this.escapeText(title)}">
    <${getEmbedSymbol(embedName)} />
  </SideBarCta>
</p>`
    );
  }

  // TODO: need to type this properly, but we can't import types from assets
  // since they can't be built as part of this TS project
  public appendTryItNow(props: Record<string, unknown> = {}) {
    this.insertComponentImport("TryItNow", "TryItNow/index.tsx");
    const escapedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => [
        key,
        typeof value === "string"
          ? this.escapeText(value, { mdxOnly: true })
          : JSON.stringify(value),
      ])
    );
    this.#lines.push(`<TryItNow {...${JSON.stringify(escapedProps)}} />`);
  }

  public finalize() {
    let imports = "";
    for (const [importPath, symbols] of this.#imports) {
      if (symbols.defaultAlias && symbols.namedImports.size > 0) {
        imports += `import ${symbols.defaultAlias}, { ${Array.from(
          symbols.namedImports
        ).join(", ")} } from "${importPath}";\n`;
      } else if (symbols.defaultAlias) {
        imports += `import ${symbols.defaultAlias} from "${importPath}";\n`;
      } else {
        imports += `import { ${Array.from(symbols.namedImports).join(", ")} } from "${importPath}";\n`;
      }
    }
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      (imports ? imports + "\n\n" : "") +
      (this.#includeSidebar ? "<SideBar />\n\n" : "") +
      this.#lines.join("\n\n");
    this.#lines = [];
    this.#site[SAVE_PAGE](this.#currentPagePath, data);
  }

  #insertDefaultImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
    }
    // Will never be undefined due to the above. I wish TypeScript could narrow
    // map/set has calls
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#imports.get(importPath)!.defaultAlias = symbol;
  }

  #insertNamedImport(importPath: string, symbol: string) {
    if (!this.#imports.has(importPath)) {
      this.#imports.set(importPath, {
        defaultAlias: undefined,
        namedImports: new Set(),
      });
    }
    this.#imports.get(importPath)?.namedImports.add(symbol);
  }

  #insertEmbedImport(embedName: string) {
    const embedPath = getEmbedPath(embedName);

    // TODO: handle this more gracefully. This happens when we have a direct
    // circular dependency, and the page needs to import itself
    if (this.#currentPagePath === embedPath) {
      return false;
    }

    let importPath = relative(dirname(this.#currentPagePath), embedPath);
    // Check if this is an import to a file in the same directory, which
    // for some reason relative doesn't include the ./ in
    if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
      importPath = `./${importPath}`;
    }
    this.#insertDefaultImport(importPath, getEmbedSymbol(embedName));

    return true;
  }

  public insertComponentImport(symbol: string, componentPath: string) {
    const importPath = relative(
      dirname(this.#currentPagePath),
      join(getSettings().output.componentOutDir, componentPath)
    );
    this.#insertNamedImport(importPath, symbol);
  }
}
