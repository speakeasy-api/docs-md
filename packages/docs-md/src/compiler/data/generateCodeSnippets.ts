import { basename } from "node:path";

import type { Chunk, OperationChunk } from "../../types/chunk.ts";
import type {
  CodeSamplesResponse,
  CodeSnippet,
  ErrorResponse,
} from "../../types/codeSnippet.ts";
import { getSettings } from ".././settings.ts";

const CODE_SNIPPETS_API_URL =
  process.env.SPEAKEASY_CODE_SNIPPETS_API_URL ?? "https://api.speakeasy.com";

export type DocsCodeSnippets = Record<OperationChunk["id"], CodeSnippet>;

export const generateCodeSnippets = async (
  docsData: Map<string, Chunk>,
  specContents: string
): Promise<DocsCodeSnippets> => {
  const { spec, tryItNow } = getSettings();
  if (!tryItNow) {
    return {};
  }

  const docsCodeSnippets: DocsCodeSnippets = {};

  const specFilename = basename(spec);
  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData.values()) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }
  try {
    const formData = new FormData();

    const blob = new Blob([specContents]);
    formData.append("language", "typescript");
    formData.append("schema_file", blob, specFilename);
    formData.append("package_name", tryItNow.npmPackageName);
    formData.append("sdk_class_name", tryItNow.sdkClassName);

    const res = await fetch(`${CODE_SNIPPETS_API_URL}/v1/code_sample/preview`, {
      method: "POST",
      body: formData,
    });

    const json = (await res.json()) as unknown;

    if (!res.ok) {
      const error = json as ErrorResponse;
      throw new Error(`Failed to generate code sample: ${error.message}`);
    }
    const codeSnippets = (json as CodeSamplesResponse).snippets;

    for (const snippet of codeSnippets) {
      const chunk = operationChunksByOperationId.get(snippet.operationId);
      // only set the usage snippet if the operation id exists in the spec
      if (chunk) {
        docsCodeSnippets[chunk.id] = snippet;
      }
    }
  } catch (error) {
    console.error("There was an error generating code snippets", error);
    return {};
  }
  return docsCodeSnippets;
};
