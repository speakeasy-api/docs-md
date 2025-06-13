import type {CodeSamplesResponse,ErrorResponse,UsageSnippet } from "../types/usageSnippets.ts";

const CODE_SNIPPETS_API_URL = "http://api.speakeasy.com";

export async function fetchCodeSnippets(
  language: string,
  schemeFile: {
    fileName: string;
    content: string;
  },
  operationIds: string[],
  packageName: string,
): Promise<UsageSnippet[]> {
  const formData = new FormData();

  const blob = new Blob([schemeFile.content]);
  formData.append("language", language);
  formData.append("schema_file", blob, schemeFile.fileName);
  formData.append("operation_ids", operationIds.join(","));
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


