import type { PageMetadata } from "@speakeasy-api/docs-md-shared/types";

import type { SiteBuildPagePathArgs } from "../renderers/base.ts";

export type PageFrontMatter = {
  sidebarPosition: string;
  sidebarLabel: string;
};

type BaseCompilerConfig = {
  rendererType: string;
  buildPagePath: (...args: SiteBuildPagePathArgs) => string;
  buildPagePreamble: (frontMatter: PageFrontMatter) => string;
  postProcess?: (pageMetadata: PageMetadata[]) => void;
  formatHeadingId?: (id: string) => string;
  elementIdSeparator?: string;
};

type MDXCompilerConfig = BaseCompilerConfig & {
  rendererType: "mdx";
  componentPackageName: string;
};

// TODO: add Web Component config once we support it

export type CompilerConfig = MDXCompilerConfig;
