import type { OperationChunk, SchemaValue } from "./chunk.ts";

export type PillVariant =
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";

/**
 * Display type info contains parsed information about the type of a schema
 * value that is tailored for display in the UI.
 */
export type DisplayTypeInfo = {
  /**
   * The read-only label for the type, e.g. `string` or `MyObjectName`. This
   * version of the label is typically used to measure how wide the label is.
   */
  label: string;
  /**
   * The linked label for the type, e.g. `string` or `<a
   * href="#id-of-object">MyObjectName</a>`. This version of the label is
   * typically used to actually render the label in the UI.
   */
  linkedLabel: string;
  /**
   * The children of the type, e.g. if the type is `array<SchemaOne | SchemaTwo>`
   * then there would be one child of type union, which has two children of
   * type `SchemaOne` and `SchemaTwo`.
   */
  children: DisplayTypeInfo[];
  /**
   * The schemas for the breakouts. These correlate with display type info
   * nodes in `children`.
   */
  breakoutSubTypes: Map<string, SchemaValue>;
};

/**
 * A property annotation is an entry for a property, such as `required` or
 * `deprecated`, along with a Pill variant, such as `warning` or `info`, to
 * render it in the UI.
 */
export type PropertyAnnotations = {
  title: string;
  variant: PillVariant;
};

export type PageMetadataSection = {
  elementId: string;
  properties: {
    elementId: string;
    name: string;
  }[];
};

export type PageMetadataOperation = {
  elementId: string;
  method: string;
  path: string;
  operationId: OperationChunk["chunkData"]["operationId"];
  summary: OperationChunk["chunkData"]["summary"];
  security?: PageMetadataSection;
  parameters?: PageMetadataSection;
  requestBody?: PageMetadataSection;

  // Map is from status code + response type to section
  responses?: Record<string, PageMetadataSection>;
};

export type PageMetadataTag = {
  name: string;
  operations: PageMetadataOperation[];
};

/**
 * Page metadata contains useful information about a page that was compiled.
 * This information can be used to render a left nav, add metadata files
 * specific to a scaffold (such as _category_.json in Docusaurus), etc.
 */
export type PageMetadata = {
  slug: string;
  sidebarLabel: string;
  tags: PageMetadataTag[];
};
