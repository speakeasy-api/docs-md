import { randomUUID } from "node:crypto";
import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
} from "node:fs";
import { get } from "node:https";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";
import { extract } from "tar";

import { info } from "../logging.ts";
import { getSettings } from "../settings.ts";

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

    get(url, options, (response) => {
      // Handle redirects
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        file.close();
        downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          resolve();
        });
      });
    }).on("error", (err) => {
      file.close();
      reject(err);
    });
  });
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

  const codeSampleResponses = new Map<string, CodeSample[]>();

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      const exampleReadmeContents: string[] = [];
      for (const example of examples) {
        const readmePath = join(
          extractedDirPath,
          "docs",
          "sdks",
          example,
          "README.md"
        );
        exampleReadmeContents.push(readFileSync(readmePath, "utf-8"));
      }

      // Parse the example contents
      console.log(exampleReadmeContents);
    }
  } finally {
    rmdirSync(extractionTempDirBase, { recursive: true });
  }

  // Populate docsCodeSamples with the code samples, prioritizing code samples
  // from the OAS and falling back to the fetched samples if absent
  for (const chunk of docsData.values()) {
    if (chunk.chunkType !== "operation") {
      continue;
    }

    const chunkCodeSamples: Record<string, CodeSample> = {};

    // First, populate the list of samples fetched remotely
    for (const [language, codeSampleResponse] of codeSampleResponses) {
      const operationCodeSampleResponses = codeSampleResponse.filter(
        (sample) => sample.operationId === chunk.chunkData.operationId
      );
      if (operationCodeSampleResponses.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chunkCodeSamples[language] = operationCodeSampleResponses[0]!;
      }
    }

    // Then, overwrite any fetched samples with ones that are defined in the OAS
    for (const [language, code] of Object.entries(
      chunk.chunkData.codeSamples
    )) {
      chunkCodeSamples[language] = {
        code,
        language,
        operationId: chunk.chunkData.operationId,

        // TODO: remove this once we move away from dynamically fetching
        // packages in Try It Now.
        packageName: "",
      };
    }
    docsCodeSamples[chunk.id] = chunkCodeSamples;
  }

  return docsCodeSamples;
}
