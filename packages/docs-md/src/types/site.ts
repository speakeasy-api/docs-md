import type { Renderer } from "./renderer.ts";

export interface Site {
  createPage(path: string): Renderer;
  render(): Record<string, string>;
  buildPagePath(slug: string): string;
  hasPage(path: string): boolean;
}
