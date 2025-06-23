export type Escape = "markdown" | "html" | "mdx" | "none";

export type AppendOptions = {
  escape?: Escape;
};

export type RendererConstructor = new (options: {
  currentPagePath: string;
}) => Renderer;

export interface Renderer {
  escapeText(text: string, options: { escape: Escape }): string;

  insertFrontMatter(options: {
    sidebarPosition: string;
    sidebarLabel: string;
  }): void;

  appendHeading(level: number, text: string, options?: AppendOptions): void;

  appendParagraph(text: string, options?: AppendOptions): void;

  appendCodeBlock(
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
        }
  ): void;

  appendList(items: string[], options?: AppendOptions): void;

  appendRaw(text: string): void;

  beginExpandableSection(
    title: string,
    options?: { isOpenOnLoad?: boolean } & AppendOptions
  ): void;

  endExpandableSection(): void;

  appendSidebarLink(options: { title: string; embedName: string }): void;

  appendTryItNow(options: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }): void;

  finalize(): string;
}
