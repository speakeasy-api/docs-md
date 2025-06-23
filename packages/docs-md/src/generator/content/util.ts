import type { Chunk } from "../../types/chunk.ts";

export function getSchemaFromId(
  schemaId: string,
  docsData: Map<string, Chunk>
) {
  const schemaChunk = docsData.get(schemaId);
  if (!schemaChunk) {
    throw new Error(`Could not find schema chunk: ${schemaId}`);
  }
  if (schemaChunk.chunkType !== "schema") {
    throw new Error(`Schema chunk is not of type schema: ${schemaId}`);
  }
  return schemaChunk;
}

export function getOperationFromId(
  operationId: string,
  docsData: Map<string, Chunk>
) {
  const operationChunk = docsData.get(operationId);
  if (!operationChunk) {
    throw new Error(`Could not find operation chunk: ${operationId}`);
  }
  if (operationChunk.chunkType !== "operation") {
    throw new Error(`Operation chunk is not of type operation: ${operationId}`);
  }
  return operationChunk;
}
