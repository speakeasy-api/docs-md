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
export type RendererAppendCodeBlockArgs = [
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
  abstract createText(...args: RendererAppendTextArgs): void;
  abstract appendText(...args: RendererAppendTextArgs): void;
  abstract createCodeBlock(...args: RendererAppendCodeBlockArgs): void;
  abstract appendCodeBlock(...args: RendererAppendCodeBlockArgs): void;
  abstract createList(...args: RendererAppendListArgs): void;
  abstract appendList(...args: RendererAppendListArgs): void;
  abstract createExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ): void;
  abstract appendExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ): void;
  abstract createExpandableSectionEnd(
    ...args: RendererEndExpandableSectionArgs
  ): void;
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
