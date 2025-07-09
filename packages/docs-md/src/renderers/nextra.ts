import { join, resolve } from "node:path";

import type { DeepPartial, SandpackTheme } from "@codesandbox/sandpack-react";
import type { Theme } from "rehype-pretty-code";
import type { ThemeRegistrationAny, ThemeRegistrationResolved } from "shiki";
import { normalizeTheme } from "shiki";

import type { NextraTheme, ShikiTheme } from "../types/nextra.ts";
import { getSettings } from "../util/settings.ts";
import type {
  RendererAppendCodeArgs,
  RendererAppendHeadingArgs,
  RendererAppendSidebarLinkArgs,
  RendererBeginExpandableSectionArgs,
  RendererInsertFrontMatterArgs,
  SiteBuildPagePathArgs,
  SiteGetRendererArgs,
} from "./base/base.ts";
import { rendererLines } from "./base/markdown.ts";
import { MdxRenderer, MdxSite } from "./base/mdx.ts";
import { getEmbedPath, getEmbedSymbol } from "./base/util.ts";

export class NextraSite extends MdxSite {
  #rehypeTheme: ShikiTheme;

  constructor(options: {
    rehypeTheme?: Theme | Record<string, Theme> | undefined | null;
  }) {
    super();
    this.#rehypeTheme = processNextraTheme(options.rehypeTheme);
  }

  public override buildPagePath(
    ...[slug, { appendIndex = false } = {}]: SiteBuildPagePathArgs
  ): string {
    const settings = getSettings();
    if (appendIndex) {
      slug += "/index";
    }
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  }

  public override render() {
    const settings = getSettings();
    const schemasEntry = settings.display.showSchemasInNav
      ? `\n  schemas: { title: "Schemas", theme: { collapsed: false } },`
      : "";
    const config = `export default {
  index: { title: "About", theme: { collapsed: false } },
  tag: { title: "Operations", theme: { collapsed: false } },${schemasEntry}
}`;
    this.createPage(join(settings.output.pageOutDir, "_meta.ts")).appendText(
      config,
      { escape: "none" }
    );
    return super.render();
  }

  protected override getRenderer(...[options]: SiteGetRendererArgs) {
    return new NextraRenderer(
      { ...options, rehypeTheme: this.#rehypeTheme },
      this
    );
  }
}

class NextraRenderer extends MdxRenderer {
  #frontMatter: string | undefined;
  #includeSidebar = false;
  #currentPagePath: string;
  #site: NextraSite;
  #sandpackTheme: { dark: DeepPartial<SandpackTheme> | "dark"; light: DeepPartial<SandpackTheme> | "light" };

  constructor(
    {
      currentPagePath,
      rehypeTheme,
    }: { currentPagePath: string; rehypeTheme: ShikiTheme },
    site: NextraSite
  ) {
    super();
    this.#currentPagePath = currentPagePath;
    this.#site = site;
    this.#sandpackTheme = convertShikiToSandpackTheme(rehypeTheme);
  }

  public override insertFrontMatter(
    ...[{ sidebarLabel }]: RendererInsertFrontMatterArgs
  ) {
    this.#frontMatter = `---
sidebarTitle: ${this.escapeText(sidebarLabel, { escape: "mdx" })}
---`;
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
      // Oddly enough, Nextra uses a different syntax for heading IDs
      line += ` [#${id}]`;
    }
    return line;
  }

  public override createCode(...[text, options]: RendererAppendCodeArgs) {
    if (options?.variant === "raw") {
      if (options.style === "inline") {
        return `<code className="nextra-code">${this.escapeText(text, { escape: options?.escape ?? "html" })}</code>`;
      }
      return `<pre className="x:group x:focus-visible:nextra-focus x:overflow-x-auto x:subpixel-antialiased x:text-[.9em] x:bg-white x:dark:bg-black x:py-4 x:ring-1 x:ring-inset x:ring-gray-300 x:dark:ring-neutral-700 x:contrast-more:ring-gray-900 x:contrast-more:dark:ring-gray-50 x:contrast-more:contrast-150 x:rounded-md not-prose">
<code className="nextra-code">
${this.escapeText(text, { escape: options?.escape ?? "html" })
  .split("\n")
  // Nextra does this weird thing where it wraps each line in _two_ spans with
  // it's code blocks, so we mimic that behavior here
  .map((line) => `<span><span>${line}</span></span>`)
  .join("\n")}
</code>
</pre>`;
    } else {
      return super.createCode(text, options);
    }
  }

  public override createExpandableSectionStart(
    ...[title, id, { escape = "mdx" } = {}]: RendererBeginExpandableSectionArgs
  ) {
    this.insertThirdPartyImport(
      "ExpandableSection",
      "@speakeasy-api/docs-md/nextra"
    );
    return `<ExpandableSection title="${this.escapeText(title, { escape })}" id="${id}">`;
  }

  public override createExpandableSectionEnd() {
    return "</ExpandableSection>";
  }

  public override appendSidebarLink(
    ...[{ title, embedName }]: RendererAppendSidebarLinkArgs
  ) {
    const embedPath = getEmbedPath(embedName);

    // TODO: handle this more gracefully. This happens when we have a direct
    // circular dependency, and the page needs to import itself, which can't be
    // done of course
    if (this.#currentPagePath === embedPath) {
      return;
    }

    const importPath = this.getRelativeImportPath(
      this.#currentPagePath,
      embedPath
    );
    this.insertDefaultImport(importPath, getEmbedSymbol(embedName));

    this.#includeSidebar = true;
    this.insertThirdPartyImport(
      "SideBarTrigger",
      "@speakeasy-api/docs-md/nextra"
    );
    this.insertThirdPartyImport("SideBar", "@speakeasy-api/docs-md/nextra");
    this[rendererLines].push(
      `<p>
    <SideBarTrigger cta="${`View ${this.escapeText(title, { escape: "mdx" })}`}" title="${this.escapeText(title, { escape: "mdx" })}">
      <${getEmbedSymbol(embedName)} />
    </SideBarTrigger>
  </p>`
    );

    if (this.#site.hasPage(embedPath)) {
      return;
    }
    return this.#site.createPage(embedPath);
  }

  public override appendTryItNow({
    externalDependencies,
    defaultValue,
  }: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }) {
    this.insertThirdPartyImport("TryItNow", "@speakeasy-api/docs-md/nextra");
    this[rendererLines].push(
      `<TryItNow
   externalDependencies={${JSON.stringify(externalDependencies)}}
   defaultValue={\`${defaultValue}\`}
   themes={${JSON.stringify(this.#sandpackTheme)}}
  />`
    );
  }

  public override render() {
    const parentData = super.render();
    const data =
      (this.#frontMatter ? this.#frontMatter + "\n\n" : "") +
      parentData +
      (this.#includeSidebar ? "\n\n<SideBar />\n" : "");
    return data;
  }
}

function processNextraTheme(theme?: NextraTheme | null): ShikiTheme {
  const defaultShikiTheme = {
    light: "github-light",
    dark: "github-dark",
  };

  if (!theme) {
    return defaultShikiTheme;
  }

  // if the theme is a string, return it
  if (typeof theme === "string") {
    return {
      dark: theme,
      light: theme,
    };
  }

  if (
    typeof theme === "object" &&
    theme !== null &&
    ("dark" in theme || "light" in theme)
  ) {
    const dark = theme?.dark ?? undefined;
    const light = theme?.light ?? undefined;
    if (typeof dark === "string" && typeof light === "string") {
      return {
        dark,
        light,
      };
    } else {
      console.error(theme);
      throw new Error(
        "Invalid theme object. Please use a string or an object with dark and light properties."
      );
    }
  }

  if (theme) {
    // theme is an object, but doesn't have dark or light properties so we have to manually parse this in
    const normalizedTheme = normalizeTheme(theme as ThemeRegistrationAny);
    const themeResult: ShikiTheme = {};
    if (normalizedTheme.type === "dark") {
      themeResult.dark = normalizedTheme;
    }
    if (normalizedTheme.type === "light") {
      themeResult.light = normalizedTheme;
    }
    return themeResult;
  }
  return defaultShikiTheme;
}

function convertShikiToSandpackTheme(
  shikiTheme: ShikiTheme
): { dark: DeepPartial<SandpackTheme> | "dark"; light: DeepPartial<SandpackTheme> | "light" } {
  const darkTheme = shikiTheme?.dark;
  const lightTheme = shikiTheme?.light;

  const convertTheme = (theme: string | ThemeRegistrationResolved | undefined) => {

  // TODO: when it is a string, we have to load the theme
  // from the shiki npm package
    if (!theme || typeof theme !== "object") return null;
    const { settings } = theme;
    const colorThemeMap = new Map<string, string>();
    const scopeKeyWords = [
      "comment",
      "punctuation.definition.tag",
      "keyword",
      "variable.language",
    ];
    settings.forEach((setting) => {
      const scope = setting.scope;
      if (typeof scope === "string" && scopeKeyWords.includes(scope)) {
        colorThemeMap.set(scope, setting.settings.foreground ?? "");
      }
    });

    return {
      colors: {
        base: theme?.fg,
        surface1: theme?.bg,
      },
      syntax: {
        string: theme?.semanticTokenColors?.stringLiteral,
        comment: colorThemeMap.get("comment"),
        keyword: colorThemeMap.get("keyword"),
        property: theme?.semanticTokenColors?.stringLiteral,
        tag: colorThemeMap.get("punctuation.definition.tag"),
        plain: theme?.fg,
        definition: colorThemeMap.get("variable.language"),
        punctuation: theme?.fg,
      },
    };
  };

  return {
    dark: convertTheme(darkTheme) ?? "dark",
    light: convertTheme(lightTheme) ?? "light",
  };
}
