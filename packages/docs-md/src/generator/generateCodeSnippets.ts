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
  sdkClassName: string
): Promise<UsageSnippet[]> {
  const formData = new FormData();

  const blob = new Blob([schemeFile.content]);
  formData.append("language", language);
  formData.append("schema_file", blob, schemeFile.fileName);
  formData.append("operation_ids", operationIds.join(","));
  formData.append("package_name", packageName);
  formData.append("sdk_class_name", sdkClassName);

  // Get exact request size
  const getRequestSize = (formData: FormData): number => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let size = 0;
    
    for (const [key, value] of formData.entries()) {
      // Add boundary and headers for each field
      size += `--${boundary}\r\n`.length;
      size += `Content-Disposition: form-data; name="${key}"\r\n\r\n`.length;
      
      if (value instanceof Blob) {
        size += value.size;
      } else {
        size += String(value).length;
      }
      size += '\r\n'.length;
    }
    
    // Add final boundary
    size += `--${boundary}--\r\n`.length;
    return size;
  };

  const requestSize = getRequestSize(formData);
  console.log(`Request size: ${requestSize} bytes`);

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


