// These types are mirrors of the types in Go defined at:
// https://github.com/speakeasy-api/openapi-generation/blob/9360544609e4c3a0320bd0b2a039b49008944197/internal/docsData
// One day, we'll create an automated mechanism to keep them in sync

// About chunks

type Server = {
  url: string;
};

type AboutData = {
  title: string;
  description: string;
  version: string;
  servers: Server[];
};

export type AboutChunk = {
  id: string;
  slug: string;
  chunkData: AboutData;
  chunkType: "about";
};

// Operation chunks

type Security = {
  contentChunkId: string;
};

type Parameter = {
  name: string;
  description: string | null;
  required: boolean;
  fieldChunkId: string;
};

type Response = {
  description: string | null;
  contentType: string;
  contentChunkId: string;
};

type RequestBody = {
  description: string | null;
  required: boolean;
  contentChunkId: string;
};

type OperationData = {
  operationId: string;
  path: string;
  method: string;
  tag: string;
  summary: string | null;
  description: string | null;
  security: Security | null;
  globalSecurity: Security | null;
  parameters: Parameter[];
  requestBody: RequestBody | null;
  responses: Record<string, Response[]>;
};

export type OperationChunk = {
  id: string;
  slug: string;
  chunkData: OperationData;
  chunkType: "operation";
};

// Schema chunks

type ChunkValue = {
  type: "chunk";
  chunkId: string;
};

type AnyValue = {
  type: "any";
};

type BaseValue = {
  description: string | null;
  examples: string[];
  isNullable: boolean;
  defaultValue: string | null;
};

type NullValue = BaseValue & {
  type: "null";
};

type BooleanValue = BaseValue & {
  type: "boolean";
};

type StringValue = BaseValue & {
  type: "string";
};

type DateValue = BaseValue & {
  type: "date";
};

type DateTimeValue = BaseValue & {
  type: "date-time";
};

type NumberValue = BaseValue & {
  type: "number";
};

type IntegerValue = BaseValue & {
  type: "integer";
};

type Int32Value = BaseValue & {
  type: "int32";
};

type BigIntValue = BaseValue & {
  type: "bigint";
};

type Float32Value = BaseValue & {
  type: "float32";
};

type DecimalValue = BaseValue & {
  type: "decimal";
};

type EnumValue = BaseValue & {
  type: "enum";
  values: string[];
};

export type ObjectValue = BaseValue & {
  type: "object";
  properties: Record<string, SchemaValue>;
  required: string[];
  name: string;
};

export type ArrayValue = BaseValue & {
  type: "array";
  items: SchemaValue;
};

export type SetValue = BaseValue & {
  type: "set";
  items: SchemaValue;
};

export type MapValue = BaseValue & {
  type: "map";
  items: SchemaValue;
};

type BinaryValue = BaseValue & {
  type: "binary";
};

export type UnionValue = BaseValue & {
  type: "union";
  values: SchemaValue[];
};

export type SchemaValue =
  | NullValue
  | StringValue
  | DateValue
  | DateTimeValue
  | BooleanValue
  | NumberValue
  | IntegerValue
  | Int32Value
  | Float32Value
  | DecimalValue
  | BigIntValue
  | ObjectValue
  | ArrayValue
  | SetValue
  | MapValue
  | UnionValue
  | EnumValue
  | BinaryValue
  | AnyValue
  | ChunkValue;

type SchemaChunk = {
  id: string;
  slug: string;
  chunkData: { name: string; value: SchemaValue };
  chunkType: "schema";
};

// Tag chunk

type TagData = {
  name: string;
  operationChunkIds: string[];
};

export type TagChunk = {
  id: string;
  slug: string;
  chunkData: TagData;
  chunkType: "tag";
};

// All chunks

export type Chunk = AboutChunk | OperationChunk | SchemaChunk | TagChunk;
