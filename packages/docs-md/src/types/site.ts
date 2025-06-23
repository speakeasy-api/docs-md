import type { Renderer } from "./renderer.ts";

export interface Site {
  createPage(path: string): Renderer;
  createEmbedPage(embedName: string): Renderer | undefined;
  finalize(): Record<string, string>;
  buildPagePath(slug: string): string;
  hasPage(path: string): boolean;
}
