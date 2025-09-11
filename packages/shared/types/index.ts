import type { SchemaValue } from "./chunk.ts";

export type {
  Chunk,
  AboutChunk,
  GlobalSecurityChunk,
  SecurityChunk,
  TagChunk,
  SchemaChunk,
  OperationChunk,
  SchemaValue,
  ObjectValue,
} from "./chunk.ts";

export type PillVariant =
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";

export type DisplayTypeInfo = {
  label: string;
  linkedLabel: string;
  children: DisplayTypeInfo[];
  breakoutSubTypes: Map<string, SchemaValue>;
};

export type PropertyAnnotations = {
  title: string;
  variant: PillVariant;
};

export type PageMetadataSection = {
  fragment: string;
  properties: {
    fragment: string;
    name: string;
  }[];
};

export type PageMetadataOperation = {
  fragment: string;
  method: string;
  path: string;
  security?: PageMetadataSection;
  parameters?: PageMetadataSection;
  requestBody?: PageMetadataSection;

  // Map is from status code + response type to section
  responses?: Record<string, PageMetadataSection>;
};

export type PageMetadata = {
  slug: string;
  sidebarLabel: string;
  sidebarPosition: string;
  operations: PageMetadataOperation[];
};
