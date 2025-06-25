export type Escape = "markdown" | "html" | "mdx" | "none";

export type AppendOptions = {
  escape?: Escape;
};

export interface Renderer {
  escapeText(text: string, options: { escape: Escape }): string;

  insertFrontMatter(options: {
    sidebarPosition: string;
    sidebarLabel: string;
  }): void;

  appendHeading(level: number, text: string, options?: AppendOptions): void;

  appendText(text: string, options?: AppendOptions): void;

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

  beginExpandableSection(
    title: string,
    options?: { isOpenOnLoad?: boolean } & AppendOptions
  ): void;

  endExpandableSection(): void;

  appendSidebarLink(options: {
    title: string;
    embedName: string;
  }): Renderer | undefined;

  appendTryItNow(options: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  }): void;

  render(): string;
}
