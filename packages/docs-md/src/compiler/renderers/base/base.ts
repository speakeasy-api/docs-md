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

import type { Chunk } from "../../../types/chunk.ts";
import type {
  DisplayTypeInfo,
  PillVariant,
  PropertyAnnotations,
  SectionVariant,
} from "../../../types/shared.ts";

type ContextType = "operation" | "section" | "schema";

export type Context = {
  id: string;
  type: ContextType;
};

// Argument types for Site interface methods
export type SiteCreatePageArgs = [path: string];
export type SiteBuildPagePathArgs = [
  slug: string,
  options?: { appendIndex?: boolean },
];
export type SiteHasPageArgs = [path: string];
export type SiteGetRendererArgs = [args: RendererConstructorArgs];

export abstract class Site {
  abstract setDocsData(docsData: Map<string, Chunk>): void;
  abstract createPage(...args: SiteCreatePageArgs): Renderer;
  abstract render(): Record<string, string>;
  abstract buildPagePath(...args: SiteBuildPagePathArgs): string;
  abstract hasPage(...args: SiteHasPageArgs): boolean;
  protected abstract getRenderer(...args: SiteGetRendererArgs): Renderer;
}

type Escape = "markdown" | "html" | "mdx" | "none";

type AppendOptions = {
  escape?: Escape;
};

// Argument types for Renderer interface methods
export type RendererEscapeTextArgs = [
  text: string,
  options: { escape: Escape },
];
export type RendererInsertFrontMatterArgs = [
  options: {
    sidebarPosition: string;
    sidebarLabel: string;
  },
];
export type RendererAppendHeadingArgs = [
  level: number,
  text: string,
  options?: AppendOptions & { id?: string },
];
export type RendererCreateAppendTextArgs = [
  text: string,
  options?: AppendOptions,
];
export type RendererCreateAppendCodeArgs = [
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
        /**
         * The style to use for the code block. If the style is "block", then
         * the code will be rendered using <pre> + <code> tags for raw variants,
         * and triple backtick blocks for default variants. If the style is
         * "inline", then the code will be rendered using just a <code> tag for
         * raw variants, and a single backtick for default variants.
         */
        style?: "block" | "inline";
        escape?: Escape;
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
        /**
         * The style to use for the code block. If the style is "block", then
         * the code will be rendered using <pre> + <code> tags for raw variants,
         * and triple backtick blocks for default variants. If the style is
         * "inline", then the code will be rendered using just a <code> tag for
         * raw variants, and a single backtick for default variants.
         */
        style?: "block" | "inline";
        escape?: Escape;
      },
];
export type RendererCreatePillArgs = [variant: PillVariant];
export type RendererCreateListArgs = [items: string[], options?: AppendOptions];
export type RendererCreateSectionArgs = [
  options?: {
    variant?: SectionVariant;
  },
];
export type RendererCreateSectionTitleArgs = [
  options?: {
    variant?: SectionVariant;
  },
];
export type RendererCreateSectionContentArgs = [
  options?: {
    id?: string;
    variant?: SectionVariant;
  },
];
export type RendererCreateTabbedSectionTabArgs = [id: string];
export type RendererAppendSidebarLinkArgs = [
  options: {
    title: string;
    embedName: string;
  },
];
export type RendererAppendTryItNowArgs = [
  options: {
    externalDependencies: Record<string, string>;
    defaultValue: string;
  },
];

// Section args
export type RendererAddOperationArgs = [
  options: {
    method: string;
    path: string;
    operationId: string;
    summary: string | null;
    description: string | null;
  },
  cb: () => void,
];
export type RendererAddSecuritySectionArgs = [cb: () => void];
export type RendererAddParametersSectionArgs = [cb: () => void];
export type RendererAddRequestSectionArgs = [
  options: {
    isOptional: boolean;
    createFrontMatter: () => void;
    createBreakouts: () => void;
  },
];
export type RendererAddResponsesArgs = [
  cb: (
    createTab: (options: {
      statusCode: string;
      contentType: string;
      createFrontMatter: () => void;
      createBreakouts: () => void;
    }) => void
  ) => void,
  options?: {
    title?: string;
  },
];
export type RendererCreateContextArgs = [context: Context];

export type RendererAddExpandableBreakoutArgs = [
  options: {
    expandByDefault: boolean;
    createTitle: () => void;
    createContent?: () => void;
  },
];
export type RendererAddExpandablePropertyArgs = [
  options: {
    typeInfo?: DisplayTypeInfo;
    annotations: PropertyAnnotations[];
    title: string;
    expandByDefault: boolean;
    createContent?: () => void;
  },
];
export type RendererAddFrontMatterDisplayTypeArgs = [
  options: {
    typeInfo: DisplayTypeInfo;
  },
];

export type RendererAlreadyInContextArgs = [id: string];
export type RendererGetCurrentIdArgs = [postFixId?: string];

export type RendererConstructorArgs = {
  site: Site;
  docsData: Map<string, Chunk>;
  currentPagePath: string;
};

export abstract class Renderer {
  // High level operations
  abstract addOperationSection(...args: RendererAddOperationArgs): void;
  abstract addSecuritySection(...args: RendererAddSecuritySectionArgs): void;
  abstract addParametersSection(
    ...args: RendererAddParametersSectionArgs
  ): void;
  abstract addRequestSection(...args: RendererAddRequestSectionArgs): void;
  abstract addResponsesSection(...args: RendererAddResponsesArgs): void;
  abstract addExpandableBreakout(
    ...args: RendererAddExpandableBreakoutArgs
  ): void;

  // Show a property in an object schema, including it's type info
  abstract addExpandableProperty(
    ...args: RendererAddExpandablePropertyArgs
  ): void;
  abstract addFrontMatterDisplayType(
    ...args: RendererAddFrontMatterDisplayTypeArgs
  ): void;

  // Low level operations

  // The following methods are used to create basic content on the page. They
  // have "create" variants that create the content and "append"/"insert"
  // variants that append/insert the content into the current page.
  abstract createHeading(...args: RendererAppendHeadingArgs): void;
  abstract appendHeading(...args: RendererAppendHeadingArgs): void;

  abstract createText(...args: RendererCreateAppendTextArgs): string;
  abstract appendText(...args: RendererCreateAppendTextArgs): void;

  abstract createCode(...args: RendererCreateAppendCodeArgs): string;
  abstract appendCode(...args: RendererCreateAppendCodeArgs): void;

  abstract createList(...args: RendererCreateListArgs): string;
  abstract appendList(...args: RendererCreateListArgs): void;

  abstract createPillStart(...args: RendererCreatePillArgs): string;
  abstract appendPillStart(...args: RendererCreatePillArgs): void;
  abstract createPillEnd(): string;
  abstract appendPillEnd(): void;

  // Sections show a title followed by content
  abstract createSectionStart(...args: RendererCreateSectionArgs): string;
  abstract appendSectionStart(...args: RendererCreateSectionArgs): void;
  abstract createSectionEnd(): string;
  abstract appendSectionEnd(): void;
  abstract createSectionTitleStart(
    ...args: RendererCreateSectionTitleArgs
  ): string;
  abstract appendSectionTitleStart(
    ...args: RendererCreateSectionTitleArgs
  ): void;
  abstract createSectionTitleEnd(): string;
  abstract appendSectionTitleEnd(): void;
  abstract createSectionContentStart(
    ...args: RendererCreateSectionContentArgs
  ): string;
  abstract appendSectionContentStart(
    ...args: RendererCreateSectionContentArgs
  ): void;
  abstract createSectionContentEnd(): string;
  abstract appendSectionContentEnd(): void;

  abstract createDebugPlaceholderStart(): string;
  abstract appendDebugPlaceholderStart(): void;
  abstract createDebugPlaceholderEnd(): string;
  abstract appendDebugPlaceholderEnd(): void;

  // The following methods are used to insert complex content onto the page,
  // and so they don't have "create" variants.
  abstract insertFrontMatter(...args: RendererInsertFrontMatterArgs): void;

  abstract appendSidebarLink(
    ...args: RendererAppendSidebarLinkArgs
  ): Renderer | undefined;

  abstract appendTryItNow(...args: RendererAppendTryItNowArgs): void;

  // Helper methods
  abstract escapeText(...args: RendererEscapeTextArgs): string;
  abstract enterContext(...args: RendererCreateContextArgs): void;
  abstract exitContext(): void;
  abstract getCurrentContextType(): ContextType;
  abstract getSchemaDepth(): number;
  abstract alreadyInContext(...args: RendererAlreadyInContextArgs): boolean;
  abstract getCurrentId(...args: RendererGetCurrentIdArgs): string;
  abstract getDocsData(): Map<string, Chunk>;
  abstract render(): string;
}
