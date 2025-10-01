import { basename } from "node:path";

import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";

import { info } from "../logging.ts";
import { getSettings } from "../settings.ts";

type CodeSnippet = {
  operationId: string;
  language: string;
  code: string;

  // This property isn't returned from the API, but we need it for other uses
  // and have it as part of forming the request
  packageName: string;
};

type CodeSamplesResponse = {
  snippets: Omit<CodeSnippet, "packageName">[];
};

type ErrorResponse = {
  message: string;
  statusCode: number;
};

const CODE_SNIPPETS_API_URL =
  process.env.SPEAKEASY_CODE_SNIPPETS_API_URL ?? "https://api.speakeasy.com";

// Map from operation ID to language to code snippet
export type DocsCodeSnippets = Record<
  OperationChunk["id"],
  Record<string, CodeSnippet>
>;

export async function generateCodeSnippets(
  docsData: Map<string, Chunk>,
  specContents: string
): Promise<DocsCodeSnippets> {
  const { spec, codeSamples } = getSettings();
  if (!codeSamples) {
    info("Code samples not enabled, skipping code snippets generation");
    return {};
  }

  const docsCodeSnippets: DocsCodeSnippets = {};
  const specFilename = spec && basename(spec);

  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData.values()) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }

  // Fetch code snippets from the preview api
  const codeSampleResponses = new Map<string, CodeSnippet[]>();
  for (const language of codeSamples) {
    const formData = new FormData();

    const blob = new Blob([specContents]);
    formData.append("language", language.language);
    formData.append("schema_file", blob, specFilename);
    formData.append("package_name", language.packageName);
    formData.append("sdk_class_name", language.sdkClassName);

    const res = await fetch(`${CODE_SNIPPETS_API_URL}/v1/code_sample/preview`, {
      method: "POST",
      body: formData,
    });

    const json = (await res.json()) as unknown;

    if (!res.ok) {
      const error = json as ErrorResponse;
      throw new Error(`Failed to generate code sample: ${error.message}`);
    }
    const codeSnippets = (json as CodeSamplesResponse).snippets.map(
      (snippet) => ({
        ...snippet,
        packageName: language.packageName,
      })
    );
    codeSampleResponses.set(language.language, codeSnippets);
  }

  // Populate docsCodeSnippets with the code samples, prioritizing code samples
  // from the OAS and falling back to the fetched samples if absent
  for (const chunk of docsData.values()) {
    if (chunk.chunkType !== "operation") {
      continue;
    }

    const chunkCodeSnippets: Record<string, CodeSnippet> = {};

    // First, populate the list of samples fetched remotely
    for (const [language, codeSampleResponse] of codeSampleResponses) {
      const operationCodeSampleResponses = codeSampleResponse.filter(
        (sample) => sample.operationId === chunk.chunkData.operationId
      );
      if (operationCodeSampleResponses.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chunkCodeSnippets[language] = operationCodeSampleResponses[0]!;
      }
    }

    // Then, overwrite any fetched samples with ones that are defined in the OAS
    for (const [language, code] of Object.entries(
      chunk.chunkData.codeSamples
    )) {
      chunkCodeSnippets[language] = {
        code,
        language,
        operationId: chunk.chunkData.operationId,

        // TODO: remove this once we move away from dynamically fetching
        // packages in Try It Now.
        packageName: "",
      };
    }
    docsCodeSnippets[chunk.id] = chunkCodeSnippets;
  }

  return docsCodeSnippets;
}
