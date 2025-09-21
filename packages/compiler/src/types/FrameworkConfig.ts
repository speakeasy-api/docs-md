import type { PageMetadata } from "@speakeasy-api/docs-md-shared/types";

import type { SiteBuildPagePathArgs } from "../renderers/base.ts";

export type PageFrontMatter = {
  sidebarPosition: string;
  sidebarLabel: string;
};

// FrameworkConfig MUST be kept in sync with src/settings.ts

type BaseFrameworkConfig = {
  rendererType: string;
  buildPagePath: (...args: SiteBuildPagePathArgs) => string;
  buildEmbedPath?: (...args: SiteBuildPagePathArgs) => string;
  buildPagePreamble: (
    frontMatter: PageFrontMatter | undefined,
    options: { isEmbed: boolean }
  ) => string;
  postProcess?: (pageMetadata: PageMetadata[]) => void;
  formatHeadingId?: (id: string) => string;
  elementIdSeparator?: string;
};

type MDXFrameworkConfig = BaseFrameworkConfig & {
  rendererType: "mdx";
  componentPackageName: string;
};

// TODO: add Web Component config once we support it

export type FrameworkConfig = MDXFrameworkConfig;
