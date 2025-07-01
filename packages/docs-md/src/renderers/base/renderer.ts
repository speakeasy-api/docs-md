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
  options?: { isOpenOnLoad?: boolean } & AppendOptions,
];
type RendererEndExpandableSectionArgs = [];
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
  abstract createExpandableSectionEnd(
    ...args: RendererEndExpandableSectionArgs
  ): string;
  abstract appendExpandableSectionEnd(
    ...args: RendererEndExpandableSectionArgs
  ): void;

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
