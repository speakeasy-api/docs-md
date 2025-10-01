import { randomUUID } from "node:crypto";
import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { get } from "node:https";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";
import { extract } from "tar";

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
export type DocsCodeSamples = Record<
  OperationChunk["id"],
  Record<string, CodeSample>
>;

function downloadFile(url: string, destination: string) {
  return new Promise<void>((resolve, reject) => {
    const file = createWriteStream(destination);
    const options = {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };

    const request = get(url, options, (response) => {
      // Handle redirects
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        // Consume and destroy the response stream
        response.resume();
        response.destroy();
        file.close();
        downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
        return;
      }

      // Handle error status codes
      if (response.statusCode && response.statusCode >= 400) {
        response.resume();
        response.destroy();
        file.close();
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          resolve();
        });
      });

      file.on("error", (err) => {
        response.unpipe(file);
        response.destroy();
        file.close();
        reject(err);
      });

      response.on("error", (err) => {
        file.close();
        reject(err);
      });
    });

    request.on("error", (err) => {
      file.close();
      reject(err);
    });
  });
}

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

export async function generateCodeSamples(
  docsData: Map<string, Chunk>
): Promise<DocsCodeSamples> {
  const { codeSamples } = getSettings();
  if (!codeSamples) {
    info("Code samples not enabled, skipping code samples generation");
    return {};
  }

  const docsCodeSamples: DocsCodeSamples = {};

  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData.values()) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }

  // Fetch code samples from the preview api
  const extractionTempDirBase = join(tmpdir(), "speakeasy-" + randomUUID());
  try {
    for (const codeSample of codeSamples) {
      // Set up the temp directory for the code sample
      const extractionDir = join(extractionTempDirBase, codeSample.language);
      const tarballFilePath = join(
        extractionDir,
        basename(codeSample.sampleDownloadUrl)
      );
      if (!tarballFilePath.endsWith("tar.gz")) {
        throw new Error(
          `Code sample download URL must end in .tar.gz, got ${codeSample.sampleDownloadUrl}`
        );
      }
      mkdirSync(extractionDir, { recursive: true });

      // Download and extract the code sample
      await downloadFile(codeSample.sampleDownloadUrl, tarballFilePath);
      await extract({
        file: tarballFilePath,
        cwd: extractionDir,
      });

      // Read in the examples
      const extractedDirName = readdirSync(extractionDir).find(
        (item) => item !== basename(tarballFilePath)
      );
      if (!extractedDirName) {
        throw new Error(
          `Failed to extract code sample from ${tarballFilePath}`
        );
      }
      const extractedDirPath = join(extractionDir, extractedDirName);
      const examples = readdirSync(join(extractedDirPath, "docs", "sdks"));
      const codeSampleResults: CodeSample[] = [];
      for (const example of examples) {
        codeSampleResults.push(
          ...parseSampleReadme(
            join(extractedDirPath, "docs", "sdks", example, "README.md")
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
  } finally {
    rmSync(extractionTempDirBase, { recursive: true });
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
