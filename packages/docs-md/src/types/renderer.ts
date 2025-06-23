type Escape = "all" | "mdx" | "none";

type AppendOptions = {
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

  appendCode(text: string): void;

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
