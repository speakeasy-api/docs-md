// We use a fairly unusual way of defining argument types for methods. We do
// this to work around some conflicting challenges:
//
// 1. In a derived TypeScript class, we can't inherit the argument types from
//    the base class, so we have to define them again. This gets cumbersome and
//    error prone when dealing with complicated arguments, such as to createCode
// 2. We want to reuse the implementation of a parent class's method in a child
//    implementation by way of super.method().
//
// Normally we'd do `class Foo { prop: SomeTime = () => {} }` to get a complex,
// named type assigned to a method. Unfortunately, super.method() doesn't work
// in a class property though, so we have to get creative.
//
// The approach we use is to define a type _just_ for the function arguments,
// defined as a tuple. We can then use the spread operator to assign that type
// to all arguments. It's a bit verbose and convoluted, but solves both 1 and 2

// Argument types for Site interface methods
export type SiteCreatePageArgs = [path: string];
export type SiteBuildPagePathArgs = [
  slug: string,
  options?: { appendIndex?: boolean },
];
export type SiteHasPageArgs = [path: string];
export type SiteGetRendererArgs = [
  {
    currentPagePath: string;
  },
];

export abstract class Site {
  abstract createPage(...args: SiteCreatePageArgs): Renderer;
  abstract render(): Record<string, string>;
  abstract buildPagePath(...args: SiteBuildPagePathArgs): string;
  abstract hasPage(...args: SiteHasPageArgs): boolean;
  protected abstract getRenderer(...args: SiteGetRendererArgs): Renderer;
}

type Escape = "markdown" | "html" | "mdx" | "none";

type AppendOptions = {
  escape?: Escape;
};

// Argument types for Renderer interface methods
export type RendererEscapeTextArgs = [
  text: string,
  options: { escape: Escape },
];
export type RendererInsertFrontMatterArgs = [
  options: {
    sidebarPosition: string;
    sidebarLabel: string;
  },
];
export type RendererAppendHeadingArgs = [
  level: number,
  text: string,
  options?: AppendOptions & { id?: string },
];
export type RendererAppendTextArgs = [text: string, options?: AppendOptions];
export type RendererAppendCodeArgs = [
  text: string,
  options?:
    | {
        /**
         * The variant to use for the code block. If `raw`, the code will be
         * appended using a raw `<pre><code></code></pre>` block. Otherwise, the
         * code will be appended using a triple backtick block.
         */
        variant: "default";
        /**
         * The language to use for the code block. This is only used when the
         * variant is `default`.
         */
        language?: string;
        /**
         * The style to use for the code block. If the style is "block", then
         * the code will be rendered using <pre> + <code> tags for raw variants,
         * and triple backtick blocks for default variants. If the style is
         * "inline", then the code will be rendered using just a <code> tag for
         * raw variants, and a single backtick for default variants.
         */
        style?: "block" | "inline";
        escape?: Escape;
      }
    | {
        /**
         * The variant to use for the code block. If `raw`, the code will be
         * appended using a raw `<pre><code></code></pre>` block. Otherwise, the
         * code will be appended using a triple backtick block.
         */
        variant: "raw";
        /**
         * The language to use for the code block. This is only used when the
         * variant is `default`.
         */
        language?: never;
        /**
         * The style to use for the code block. If the style is "block", then
         * the code will be rendered using <pre> + <code> tags for raw variants,
         * and triple backtick blocks for default variants. If the style is
         * "inline", then the code will be rendered using just a <code> tag for
         * raw variants, and a single backtick for default variants.
         */
        style?: "block" | "inline";
        escape?: Escape;
      },
];
export type RendererAppendListArgs = [items: string[], options?: AppendOptions];
export type RendererBeginExpandableSectionArgs = [
  title: string,
  id: string,
  options?: AppendOptions,
];
export type RendererAppendSidebarLinkArgs = [
  options: {
    title: string;
    embedName: string;
  },
];
export type RendererAppendTryItNowArgs = [
  options: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  },
];

export abstract class Renderer {
  // The following methods are used to create basic content on the page. They
  // have "create" variants that create the content and "append"/"insert"
  // variants that append/insert the content into the current page.
  abstract createHeading(...args: RendererAppendHeadingArgs): void;
  abstract appendHeading(...args: RendererAppendHeadingArgs): void;
  abstract createText(...args: RendererAppendTextArgs): string;
  abstract appendText(...args: RendererAppendTextArgs): void;
  abstract createCode(...args: RendererAppendCodeArgs): string;
  abstract appendCode(...args: RendererAppendCodeArgs): void;
  abstract createList(...args: RendererAppendListArgs): string;
  abstract appendList(...args: RendererAppendListArgs): void;
  abstract createExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ): string;
  abstract appendExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ): void;
  abstract createExpandableSectionEnd(): string;
  abstract appendExpandableSectionEnd(): void;

  // The following methods are used to insert complex content onto the page,
  // and so they don't have "create" variants.
  abstract insertFrontMatter(...args: RendererInsertFrontMatterArgs): void;
  abstract appendSidebarLink(
    ...args: RendererAppendSidebarLinkArgs
  ): Renderer | undefined;
  abstract appendTryItNow(...args: RendererAppendTryItNowArgs): void;

  // Helper methods
  abstract escapeText(...args: RendererEscapeTextArgs): string;
  abstract render(): string;
}
