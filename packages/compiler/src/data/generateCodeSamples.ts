import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";

import { info } from "../logging.ts";
import { getSettings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";

const CODE_SAMPLE_HEADER =
  /^<!-- UsageSnippet language="(.+)" operationID="(.+)" method="(.+)" path="(.+)" -->$/;
const CODE_SAMPLE_START = /^```(.*)$/;
const CODE_SAMPLE_END = /^```$/;

type CodeSample = {
  operationId: string;
  language: string;
  code: string;

  // This property isn't returned from the API, but we need it for other uses
  // and have it as part of forming the request
  packageName: string;
};

// Map from operation ID to language to code sample
export type CodeSamples = Record<
  OperationChunk["id"],
  Record<string, CodeSample>
>;

function parseSampleReadme(readmePath: string) {
  const readmeContent = readFileSync(readmePath, "utf-8");

  let state: "scanning" | "reading" = "scanning";
  let codeSampleMetadata: {
    language: string;
    operationId: string;
    method: string;
    path: string;
    code: string;
  } | null = null;
  const codeSamples: Omit<CodeSample, "packageName">[] = [];

  const lines = readmeContent.split("\n");
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (state === "scanning") {
      const match = CODE_SAMPLE_HEADER.exec(line);
      if (match) {
        // Advance to the next line and ensure it's a code sample start
        i++;

        if (!CODE_SAMPLE_START.test(lines[i]!)) {
          throw new Error(`Failed to find code sample start`);
        }
        state = "reading";
        codeSampleMetadata = {
          language: match[1]!,
          operationId: match[2]!,
          method: match[3]!,
          path: match[4]!,
          code: "",
        };
      }
    } else if (state === "reading") {
      if (CODE_SAMPLE_END.test(line)) {
        state = "scanning";
        if (!codeSampleMetadata) {
          throw new InternalError(`Sample metadata is unexpectedly null`);
        }

        // Quick-n-dirty hack to clean up TypeScript examples for Try It Now
        if (codeSampleMetadata.language === "typescript") {
          codeSampleMetadata.code = codeSampleMetadata.code.replaceAll(
            /process.env\[(".*")\] \?\? ""/g,
            "$1"
          );
        }

        codeSamples.push({
          operationId: codeSampleMetadata.operationId,
          language: codeSampleMetadata.language,
          code: codeSampleMetadata.code,
        });
      } else {
        codeSampleMetadata!.code += line + "\n";
      }
    }
  }
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  return codeSamples;
}

export function generateCodeSamples(
  docsData: Map<string, Chunk>,
  sdkFolders: Map<string, string>
): CodeSamples {
  const { codeSamples } = getSettings();
  if (!codeSamples) {
    info("Code samples not enabled, skipping code samples generation");
    return {};
  }
  info("Generating Code Samples");

  const docsCodeSamples: CodeSamples = {};

  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData.values()) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }

  for (const codeSample of codeSamples) {
    // Set up the temp directory for the code sample
    const extractionDir = sdkFolders.get(codeSample.packageName);
    if (!extractionDir) {
      throw new InternalError(
        `No SDK folder found for ${codeSample.packageName}`
      );
    }

    // Read in the examples
    const examples = readdirSync(join(extractionDir, "docs", "sdks"));
    const codeSampleResults: CodeSample[] = [];
    for (const example of examples) {
      codeSampleResults.push(
        ...parseSampleReadme(
          join(extractionDir, "docs", "sdks", example, "README.md")
        ).map((sample) => ({
          ...sample,
          packageName: codeSample.packageName,
        }))
      );
    }

    // Save the results to docsCodeSamples
    for (const codeSampleResult of codeSampleResults) {
      // Find the operation chunk ID from the operation ID
      const operationChunkId = operationChunksByOperationId.get(
        codeSampleResult.operationId
      )?.id;
      if (!operationChunkId) {
        // TODO: this happens in practice, but should it?
        continue;
      }
      docsCodeSamples[operationChunkId] ??= {};
      docsCodeSamples[operationChunkId][codeSampleResult.language] =
        codeSampleResult;
    }
  }

  // Populate docsCodeSamples with the code samples, prioritizing code samples
  // from the OAS and falling back to the fetched samples if absent
  for (const chunk of docsData.values()) {
    if (chunk.chunkType !== "operation") {
      continue;
    }

    // Then, overwrite any fetched samples with ones that are defined in the OAS
    for (const [language, code] of Object.entries(
      chunk.chunkData.codeSamples
    )) {
      docsCodeSamples[chunk.id] ??= {};
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      docsCodeSamples[chunk.id]![language] = {
        code,
        language,
        operationId: chunk.chunkData.operationId,

        // TODO: remove this once we move away from dynamically fetching
        // packages in Try It Now.
        packageName: "",
      };
    }
  }

  return docsCodeSamples;
}
