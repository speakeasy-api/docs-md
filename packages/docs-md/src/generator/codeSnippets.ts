import type { Chunk, OperationChunk } from "../types/chunk.ts";
import type {
  CodeSamplesResponse,
  CodeSnippet,
  ErrorResponse,
} from "../types/codeSnippet.ts";

const codeSnippets = new Map<string, CodeSnippet>();

export function setCodeSnippet(snippet: CodeSnippet) {
  codeSnippets.set(snippet.operationId, snippet);
}

export function getCodeSnippet(operationId: string) {
  return codeSnippets.get(operationId);
}

const CODE_SNIPPETS_API_URL = "http://api.speakeasy.com";

async function fetchCodeSnippets(
  language: string,
  schemeFile: {
    fileName: string;
    content: string;
  },
  packageName: string
): Promise<CodeSnippet[]> {
  const formData = new FormData();

  const blob = new Blob([schemeFile.content]);
  formData.append("language", language);
  formData.append("schema_file", blob, schemeFile.fileName);
  formData.append("package_name", packageName);

  const res = await fetch(`${CODE_SNIPPETS_API_URL}/v1/code_sample/preview`, {
    method: "POST",
    body: formData,
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const error = json as ErrorResponse;
    throw new Error(`Failed to generate code sample: ${error.message}`);
  }
  return (json as CodeSamplesResponse).snippets;
}

export const fetchAndStoreDocsCodeSnippets = async (
  docsData: Chunk[],
  specFilename: string,
  specContents: string,
  npmPackageName: string
) => {
  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }

  const codeSnippets = await fetchCodeSnippets(
    "typescript",
    {
      fileName: specFilename,
      content: specContents,
    },
    npmPackageName
  );

  for (const snippet of codeSnippets) {
    const chunk = operationChunksByOperationId.get(snippet.operationId);
    // only set the usage snippet if the operation id exists in the spec
    if (chunk) {
      setCodeSnippet(snippet);
    }
  }
  return codeSnippets;
};
