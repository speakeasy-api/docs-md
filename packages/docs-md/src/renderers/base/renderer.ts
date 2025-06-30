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
  abstract escapeText(...args: RendererEscapeTextArgs): string;
  abstract insertFrontMatter(...args: RendererInsertFrontMatterArgs): void;
  abstract appendHeading(...args: RendererAppendHeadingArgs): void;
  abstract appendText(...args: RendererAppendTextArgs): void;
  abstract appendCodeBlock(...args: RendererAppendCodeBlockArgs): void;
  abstract appendList(...args: RendererAppendListArgs): void;
  abstract appendExpandableSectionStart(
    ...args: RendererBeginExpandableSectionArgs
  ): void;
  abstract appendExpandableSectionEnd(
    ...args: RendererEndExpandableSectionArgs
  ): void;
  abstract appendSidebarLink(
    ...args: RendererAppendSidebarLinkArgs
  ): Renderer | undefined;
  abstract appendTryItNow(...args: RendererAppendTryItNowArgs): void;
  abstract render(): string;
}
