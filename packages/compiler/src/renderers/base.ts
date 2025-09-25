// We use a fairly unusual way of defining argument types for methods. We do
// this to work around some conflicting challenges:
//
// 1. In a derived TypeScript class, we can't inherit the argument types from
//    the base class, so we have to define them again. This gets cumbersome and
//    error prone when dealing with complicated arguments, such as to createCode
// 2. We want to reuse the implementation of a parent class's method in a child
//    implementation by way of super.method().
//
// Normally we'd do `class Foo { prop: SomeTime = () => {} }` to get a complex,
// named type assigned to a method. Unfortunately, super.method() doesn't work
// in a class property though, so we have to get creative.
//
// The approach we use is to define a type _just_ for the function arguments,
// defined as a tuple. We can then use the spread operator to assign that type
// to all arguments. It's a bit verbose and convoluted, but solves both 1 and 2

import type { Chunk, TagChunk } from "@speakeasy-api/docs-md-shared/types";
import type {
  DisplayTypeInfo,
  PageMetadata,
  PillVariant,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared/types";

import type { CodeSampleLanguage } from "../settings.ts";
import type {
  FrameworkConfig,
  PageFrontMatter,
} from "../types/FrameworkConfig.ts";
import type { EscapeOptions } from "./util.ts";

type ContextType = "operation" | "section" | "schema" | "embed";

export type Context = {
  id: string;
  type: ContextType;
};

// Argument types for Site interface methods

export type SiteCreatePageArgs = [
  path: string,
  slug?: string,
  frontMatter?: PageFrontMatter,
];
export type SiteCreateEmbedArgs = [
  options: {
    slug: string;
    embedTitle: string;
    triggerText: string;
    createdEmbeddedContent: (renderer: Renderer) => void;
  },
];
export type SiteBuildPagePathArgs = [
  slug: string,
  options?: { appendIndex?: boolean },
];
export type SiteGetRendererArgs = [args: RendererConstructorArgs];

export abstract class Site {
  abstract setDocsData(docsData: Map<string, Chunk>): void;
  abstract createPage(...args: SiteCreatePageArgs): Renderer;
  // Undefined is returned when an embed circularly references another embed
  abstract createEmbed(...args: SiteCreateEmbedArgs): string | undefined;
  abstract buildPagePath(...args: SiteBuildPagePathArgs): string;
  protected abstract getRenderer(...args: SiteGetRendererArgs): Renderer;
}

// Argument types for Renderer interface methods

export type RendererConstructorArgs = {
  site: Site;
  docsData: Map<string, Chunk>;
  currentPagePath: string;
  currentPageSlug?: string;
  compilerConfig: FrameworkConfig;
  frontMatter?: PageFrontMatter;
  isEmbed: boolean;
};

// High level operations

export type RendererCreateTagSectionArgs = [
  { title: () => void; description?: () => void },
];

export type RendererCreateOperationArgs = [
  options: {
    tag: TagChunk;
    method: string;
    path: string;
    operationId: string;
    summary: string | null;
    description: string | null;
  },
  cb: () => void,
];
export type RendererCreateCodeSamplesSectionArgs = [
  cb: (options: {
    createTryItNowEntry: (options: {
      language: CodeSampleLanguage;
      externalDependencies: Record<string, string>;
      defaultValue: string;
    }) => void;
    createCodeSampleEntry: (options: {
      language: CodeSampleLanguage;
      value: string;
    }) => void;
  }) => void,
];
export type RendererCreateSecuritySectionArgs = [cb: () => void];
export type RendererCreateParametersSectionArgs = [cb: () => void];
export type RendererCreateRequestExamplesSectionArgs = [
  options: {
    createExample: () => void;
    title: string;
  },
];
export type RendererCreateRequestSectionArgs = [
  options: {
    isOptional: boolean;
    createDisplayType?: () => void;
    createDescription?: () => void;
    createBreakouts: () => void;
  },
];
export type RendererCreateResponsesExamplesSectionArgs = [
  cb: (
    createTab: (options: {
      statusCode: string;
      contentType: string;
      showContentTypeInTab: boolean;
      createExample: () => void;
    }) => void
  ) => void,
  options: {
    title: string;
  },
];
export type RendererCreateResponsesArgs = [
  cb: (
    createTab: (options: {
      statusCode: string;
      contentType: string;
      showContentTypeInTab: boolean;
      createDisplayType?: () => void;
      createDescription?: () => void;
      createBreakouts: () => void;
    }) => void
  ) => void,
  options?: {
    title?: string;
  },
];

export type RendererCreateSectionArgs = [cb: () => void];
export type RendererCreateSectionTitleArgs = [cb: () => void];
export type RendererCreateTabbedSectionArgs = [cb: () => void];
export type RendererCreateTabbedSectionTabArgs = [
  cb: () => void,
  options: {
    id: string;
  },
];
export type RendererCreateSectionContentArgs = [
  cb: () => void,
  options?: {
    id?: string;
  },
];

export type RendererCreateExpandableBreakoutArgs = [
  options: {
    rawTitle: string;
    isTopLevel: boolean;
    hasExpandableContent: boolean;
    createTitle: () => void;
    createDescription?: () => void;
    createExamples?: () => void;
    createDefaultValue?: () => void;
    createEmbed?: () => void;
    createProperties?: () => void;
  },
];
export type RendererCreateExpandablePropertyArgs = [
  options: {
    rawTitle: string;
    isTopLevel: boolean;
    hasExpandableContent: boolean;
    typeInfo?: DisplayTypeInfo;
    annotations: PropertyAnnotations[];
    createDescription?: () => void;
    createExamples?: () => void;
    createDefaultValue?: () => void;
    createEmbed?: () => void;
    createBreakouts?: () => void;
  },
];

export type RendererCreateFrontMatterDisplayTypeArgs = [
  options: {
    typeInfo: DisplayTypeInfo;
  },
];
export type RendererCreateDebugPlaceholderArgs = [
  options: {
    createTitle: () => void;
    createExample: () => void;
  },
];

export type RendererCreateEmbedArgs = [
  options: {
    slug: string;
    embedTitle: string;
    triggerText: string;
    createdEmbeddedContent: (renderer: Renderer) => void;
  },
];

// Low level operations

type LowLevelBaseOptions = {
  append?: boolean;
};

export type RendererCreateHeadingArgs = [
  level: number,
  text: string,
  options?: LowLevelBaseOptions & EscapeOptions & { id?: string },
];
export type RendererCreateTextArgs = [
  text: string,
  options?: LowLevelBaseOptions & EscapeOptions,
];
export type RendererCreateCodeArgs = [
  text: string,
  options?:
    | (LowLevelBaseOptions &
        EscapeOptions & {
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
          /**
           * The style to use for the code block. If the style is "block", then
           * the code will be rendered using <pre> + <code> tags for raw variants,
           * and triple backtick blocks for default variants. If the style is
           * "inline", then the code will be rendered using just a <code> tag for
           * raw variants, and a single backtick for default variants.
           */
          style?: "block" | "inline";
        })
    | (LowLevelBaseOptions &
        EscapeOptions & {
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
          /**
           * The style to use for the code block. If the style is "block", then
           * the code will be rendered using <pre> + <code> tags for raw variants,
           * and triple backtick blocks for default variants. If the style is
           * "inline", then the code will be rendered using just a <code> tag for
           * raw variants, and a single backtick for default variants.
           */
          style?: "block" | "inline";
        }),
];
export type RendererCreateListArgs = [
  items: string[],
  options?: LowLevelBaseOptions & EscapeOptions,
];
export type RendererCreatePillArgs = [
  variant: PillVariant,
  cb: () => string,
  options?: LowLevelBaseOptions,
];

// Context methods

export type RendererCreateContextArgs = [context: Context];
export type RendererAlreadyInContextArgs = [id: string];
export type RendererHasParentContextTypeArgs = [type: ContextType];
export type RendererGetCurrentIdArgs = [postFixId?: string];

export abstract class Renderer {
  // Metadata is undefined for embeds, since they're not full pages
  abstract render(): { contents: string; metadata?: PageMetadata };
  abstract getPagePath(): string;
  abstract createEmbed(...args: RendererCreateEmbedArgs): void;

  // High level operations

  abstract createTagSection(...args: RendererCreateTagSectionArgs): void;
  abstract createOperationSection(...args: RendererCreateOperationArgs): void;
  abstract createCodeSamplesSection(
    ...args: RendererCreateCodeSamplesSectionArgs
  ): void;
  abstract createSecuritySection(
    ...args: RendererCreateSecuritySectionArgs
  ): void;
  abstract createParametersSection(
    ...args: RendererCreateParametersSectionArgs
  ): void;
  abstract createRequestExamplesSection(
    ...args: RendererCreateRequestExamplesSectionArgs
  ): void;
  abstract createRequestSection(
    ...args: RendererCreateRequestSectionArgs
  ): void;
  abstract createResponsesExamplesSection(
    ...args: RendererCreateResponsesExamplesSectionArgs
  ): void;
  abstract createResponsesSection(...args: RendererCreateResponsesArgs): void;

  abstract createSection(...args: RendererCreateSectionArgs): void;
  abstract createSectionTitle(...args: RendererCreateSectionTitleArgs): void;
  abstract createSectionContent(
    ...args: RendererCreateSectionContentArgs
  ): void;

  abstract createExpandableBreakout(
    ...args: RendererCreateExpandableBreakoutArgs
  ): void;
  abstract createExpandableProperty(
    ...args: RendererCreateExpandablePropertyArgs
  ): void;

  abstract createFrontMatterDisplayType(
    ...args: RendererCreateFrontMatterDisplayTypeArgs
  ): void;
  abstract createDebugPlaceholder(
    ...args: RendererCreateDebugPlaceholderArgs
  ): void;

  // Low level operations

  abstract createHeading(...args: RendererCreateHeadingArgs): string;
  abstract createText(...args: RendererCreateTextArgs): string;
  abstract createCode(...args: RendererCreateCodeArgs): string;
  abstract createList(...args: RendererCreateListArgs): string;
  abstract createPill(...args: RendererCreatePillArgs): string;

  // Helper methods

  abstract getDocsData(): Map<string, Chunk>;

  // Context methods

  abstract enterContext(...args: RendererCreateContextArgs): void;
  abstract exitContext(): void;
  abstract getCurrentContextType(): ContextType;
  abstract getSchemaDepth(): number;
  abstract alreadyInContext(...args: RendererAlreadyInContextArgs): boolean;
  abstract hasParentContextType(
    ...args: RendererHasParentContextTypeArgs
  ): boolean;
  abstract getCurrentId(...args: RendererGetCurrentIdArgs): string;
}
