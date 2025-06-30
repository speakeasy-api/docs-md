import type { Renderer } from "./renderer.ts";

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
