import type { PageMetadata } from "@speakeasy-api/docs-md-shared";

import type { SiteBuildPagePathArgs } from "../renderers/base.ts";

export type PageFrontMatter = {
  sidebarPosition: string;
  sidebarLabel: string;
};

// FrameworkConfig MUST be kept in sync with src/settings.ts

type BaseFrameworkConfig = {
  rendererType: string;
  buildPagePath: (...args: SiteBuildPagePathArgs) => string;
  buildPagePreamble: (frontMatter: PageFrontMatter | undefined) => string;
  postProcess?: (pageMetadata: PageMetadata[]) => void;
  formatHeadingId?: (id: string) => string;
  elementIdSeparator?: string;
};

type MDXFrameworkConfig = BaseFrameworkConfig & {
  rendererType: "mdx";
  componentPackageName: string;
  /**
   * Strings that contain quotes, newlines, etc. need to be escaped to work
   * correctly. It's also more performant to do:
   *
   * `<MyComponent attribute="&quot;value&quot;" />`
   *
   * than
   *
   * `<MyComponent attribute={"\"value\""} />`
   *
   * However, some MDX parsers (e.g. Next.js) convert some HTML escape codes,
   * such as `&NewLine;`, `&CarriageReturn;`, and `&Tab;`, to spaces. This causes
   * us to loose all indentation and newlines.
   *
   * Since there's no one-size-fits all solution, this configuration flag tells
   * the compiler which version to use:
   * - `html` uses the more performant HTML escape codes
   * - `react-value` uses the more compatible React value syntax instead at the
   *   cost of some performance
   */
  stringAttributeEscapeStyle: "html" | "react-value";
};

type MarkdownFrameworkConfig = BaseFrameworkConfig & {
  rendererType: "markdown";
};

// TODO: add Web Component config once we support it

export type FrameworkConfig = MDXFrameworkConfig | MarkdownFrameworkConfig;
