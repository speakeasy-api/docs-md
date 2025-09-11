import type { Chunk } from "@speakeasy-api/docs-md-shared/types";

import { InternalError } from "../util/internalError.ts";

export function getSecurityFromId(
  securityId: string,
  docsData: Map<string, Chunk>
) {
  const securityChunk = docsData.get(securityId);
  if (!securityChunk) {
    throw new InternalError(`Could not find security chunk: ${securityId}`);
  }
  if (
    securityChunk.chunkType !== "security" &&
    securityChunk.chunkType !== "globalSecurity"
  ) {
    throw new InternalError(
      `Security chunk is not of type security or globalSecurity: ${securityChunk.chunkType}`
    );
  }
  return securityChunk;
}

export function getSchemaFromId(
  schemaId: string,
  docsData: Map<string, Chunk>
) {
  const schemaChunk = docsData.get(schemaId);
  if (!schemaChunk) {
    throw new InternalError(`Could not find schema chunk: ${schemaId}`);
  }
  if (schemaChunk.chunkType !== "schema") {
    throw new InternalError(`Schema chunk is not of type schema: ${schemaId}`);
  }
  return schemaChunk;
}

export function getOperationFromId(
  operationId: string,
  docsData: Map<string, Chunk>
) {
  const operationChunk = docsData.get(operationId);
  if (!operationChunk) {
    throw new InternalError(`Could not find operation chunk: ${operationId}`);
  }
  if (operationChunk.chunkType !== "operation") {
    throw new InternalError(
      `Operation chunk is not of type operation: ${operationId}`
    );
  }
  return operationChunk;
}
