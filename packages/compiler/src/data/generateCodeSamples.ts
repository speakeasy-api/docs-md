import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  Chunk,
  OperationChunk,
  SchemaValue,
} from "@speakeasy-api/docs-md-shared";
import { CurlGenerator } from "curl-generator";

import { getSchemaFromId, getSecurityFromId } from "../content/util.ts";
import { error, info, warn } from "../logging.ts";
import { getSettings } from "../settings.ts";
import { assertNever } from "../util/assertNever.ts";
import { InternalError } from "../util/internalError.ts";
import type { SdkFolder } from "./types.ts";

const CODE_SAMPLE_HEADER =
  /^<!-- UsageSnippet language="(.+)" operationID="(.+)" method="(.+)" path="(.+)" -->$/;
const CODE_SAMPLE_START = /^```(.*)$/;
const CODE_SAMPLE_END = /^```$/;

// We use a fixed list of sample strings we iterate through deterministically
// so that docs builds remain idempotent
let sampleStringIndex = 0;
const sampleStrings = [
  "cillum culpa aute minim",
  "ipsum eiusmod",
  "consequat do",
  "reprehenderit ut dolore",
  "occaecat dolor sit",
  "nostrud",
  "aute aliqua aute commodo",
  "irure",
  "dolor",
  "sunt",
  "nisi minim commodo irure minim",
  "do do sint mollit",
  "occaecat",
  "fugiat",
  "non nisi proident Lorem",
  "nostrud anim",
  "exercitation aliqua sint",
  "ut sint",
  "dolor voluptate eu",
  "quis minim non magna quis",
  "et voluptate",
  "commodo labore aliqua ad",
  "elit culpa est non",
  "dolore aliqua eu",
  "proident",
  "anim eiusmod labore",
  "ullamco",
  "voluptate aliquip",
  "et excepteur dolore commodo id",
  "in consectetur excepteur sint",
  "sunt amet",
  "duis ea",
  "nisi laborum",
  "cupidatat nulla velit",
  "magna est commodo officia",
  "velit qui velit ullamco",
  "ad do deserunt exercitation",
  "quis deserunt anim",
  "velit laboris fugiat",
  "ad occaecat elit proident ea",
];

let sampleNumberIndex = 0;
const sampleNumbers = [
  23, 87, 14, 56, 91, 32, 78, 5, 69, 41, 18, 74, 29, 85, 62, 7, 93, 36, 51, 80,
  13, 47, 25, 89, 64, 2, 71, 38, 55, 92, 16, 49, 27, 84, 61, 9, 76, 33, 58, 97,
];

type CodeSample = {
  operationId: string;
  language: string;
  code: string;
};

function initRandomSamples() {
  sampleStringIndex = 0;
  sampleNumberIndex = 0;
}

function getRandomString() {
  sampleStringIndex++;
  if (sampleStringIndex >= sampleStrings.length) {
    sampleStringIndex = 0;
  }
  return sampleStrings[sampleStringIndex];
}

function getRandomNumber() {
  sampleNumberIndex++;
  if (sampleNumberIndex >= sampleNumbers.length) {
    sampleNumberIndex = 0;
  }
  return sampleNumbers[sampleNumberIndex];
}

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

function getExplicitValue(schema: SchemaValue, fallback: unknown) {
  if (schema.type === "chunk") {
    throw new InternalError("Cannot get explicit value for chunk");
  }
  return schema.examples[0] ?? schema.defaultValue ?? fallback;
}

function generateSchemaExample(
  schema: SchemaValue,
  docsData: Map<string, Chunk>
): unknown {
  switch (schema.type) {
    case "object": {
      const obj: Record<string, unknown> = {};
      for (const [name, property] of Object.entries(schema.properties)) {
        if (!schema.required.includes(name)) {
          continue;
        }
        obj[name] = generateSchemaExample(property, docsData);
      }
      return obj;
    }
    case "array":
    case "map":
    case "set": {
      return [generateSchemaExample(schema.items, docsData)];
    }
    case "union": {
      // If we include null, which is common, default to that
      if (schema.values.find((v) => v.type === "null")) {
        return null;
      }
      const firstValue = schema.values[0];
      if (!firstValue) {
        throw new InternalError("Union has no values");
      }
      return generateSchemaExample(firstValue, docsData);
    }
    case "chunk": {
      const chunk = getSchemaFromId(schema.chunkId, docsData);
      return generateSchemaExample(chunk.chunkData.value, docsData);
    }
    case "enum": {
      return getExplicitValue(schema, schema.values[0]);
    }
    case "jsonl": {
      // TODO?
      return "{}";
    }
    case "event-stream": {
      // TODO?
      return null;
    }
    case "binary":
    case "string": {
      return getExplicitValue(schema, getRandomString());
    }
    case "boolean": {
      return getExplicitValue(schema, false);
    }
    case "number":
    case "bigint":
    case "integer":
    case "int32":
    case "float32":
    case "decimal": {
      return getExplicitValue(schema, getRandomNumber());
    }
    case "date":
    case "date-time": {
      return getExplicitValue(schema, "2025-10-07T20:56:01.974Z");
    }
    case "null": {
      return null;
    }
    case "any": {
      // Hey, null counts as "any", so do the simple thing
      return getExplicitValue(schema, null);
    }
    default: {
      assertNever(schema);
    }
  }
}

function generateCurlCodeSamples(
  docsData: Map<string, Chunk>,
  docsCodeSamples: CodeSamples
) {
  // Get the server URL from the about chunk
  const aboutChunk = Array.from(docsData.values()).find(
    (chunk) => chunk.chunkType === "about"
  );
  if (!aboutChunk) {
    throw new InternalError("About chunk not found");
  }
  const { servers } = aboutChunk.chunkData;
  const server = servers[0];
  if (!server) {
    error(
      "The 'servers' field in the OpenAPI document is required when generating curl code samples"
    );
    process.exit(1);
  }

  // Get global security ahead of time
  const globalSecurityChunk = Array.from(docsData.values()).find(
    (chunk) => chunk.chunkType === "globalSecurity"
  );

  // Generate curl code samples for each operation
  for (const [, chunk] of docsData) {
    if (chunk.chunkType !== "operation") {
      continue;
    }

    // Get and validate the method against what cURl generator supports
    const method = chunk.chunkData.method.toUpperCase();
    if (
      method !== "GET" &&
      method !== "POST" &&
      method !== "PUT" &&
      method !== "PATCH" &&
      method !== "DELETE"
    ) {
      error(
        `Unsupported HTTP method ${method} for cURL code sample for operation ${chunk.chunkData.operationId}`
      );
      process.exit(1);
    }

    // Generate the headers
    const headers: Record<string, string> = {};
    for (const param of chunk.chunkData.parameters) {
      if (param.in !== "header" || !param.required) {
        continue;
      }
      // const paramChunk = getSchemaFromId(param.fieldChunkId, docsData);
      headers[param.name] = "Value incoming";
    }

    // Add security to headers, path, etc.
    const queryParams: Record<string, string> = {};
    const securityChunk = chunk.chunkData.security
      ? getSecurityFromId(chunk.chunkData.security.contentChunkId, docsData)
      : undefined;
    for (const chunk of [securityChunk, globalSecurityChunk]) {
      if (!chunk) {
        continue;
      }
      for (const security of chunk.chunkData.entries) {
        switch (security.type) {
          // We merge HTTP and API Key into a single type in our generator
          case "http":
          case "apiKey": {
            switch (security.in) {
              case "header": {
                headers[security.name] =
                  "YOUR_" + security.name.toUpperCase() + "_HERE";
                break;
              }
              case "query": {
                queryParams[security.name] =
                  "YOUR_" + security.name.toUpperCase() + "_HERE";
                break;
              }
              case "bearer": {
                headers.Authorization =
                  "Bearer YOUR_" + security.name.toUpperCase() + "_HERE";
                break;
              }
              // TODO: when we add more support for these types of security,
              // we should update the cURL runtime parser to support them too
              default: {
                warn(
                  `cURL sample generation does not currently support http/apikey security location ${security.in} and will be ignored`
                );
                break;
              }
            }
            break;
          }
          default: {
            warn(
              `cURL sample generation does not currently support security type ${security.type} and will be ignored`
            );
            break;
          }
        }
      }
    }

    // Generate the body
    let body: string | undefined = undefined;
    if (chunk.chunkData.requestBody) {
      const requestBodyChunk = getSchemaFromId(
        chunk.chunkData.requestBody.contentChunkId,
        docsData
      );
      // Reset the sample word index for each request body
      initRandomSamples();
      body = JSON.stringify(
        generateSchemaExample(requestBodyChunk.chunkData.value, docsData),
        null,
        "  "
      );
    }

    // Serialize query params
    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Generate the cURL sample
    // If anything new is added to this command, make sure to update the parser
    // at packages/shared/src/curlRuntime/runtime.ts
    const request = CurlGenerator({
      url:
        server.url +
        chunk.chunkData.path +
        (queryParamsString ? "?" + queryParamsString : ""),
      method,
      headers,
      body,
    });
    docsCodeSamples[chunk.id] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    docsCodeSamples[chunk.id]!.curl = {
      code: request,
      operationId: chunk.chunkData.operationId,
      language: "curl",
    };
  }
}

export function generateRequestResponseExamples(docsData: Map<string, Chunk>) {
  const { generateRequestBodyExamples, generateResponseExamples } =
    getSettings().output;
  for (const chunk of docsData.values()) {
    if (chunk.chunkType !== "operation") {
      continue;
    }

    // Create the request body example if one doesn't currently exist
    if (
      chunk.chunkData.requestBody &&
      !chunk.chunkData.requestBody.examples.length &&
      generateRequestBodyExamples
    ) {
      // Reset the sample word index for each request body
      initRandomSamples();
      chunk.chunkData.requestBody.examples.push({
        name: "Example",
        value: JSON.stringify(
          generateSchemaExample(
            getSchemaFromId(
              chunk.chunkData.requestBody.contentChunkId,
              docsData
            ).chunkData.value,
            docsData
          ),
          null,
          "  "
        ),
      });
    }

    // Create the response examples if they don't currently exist
    for (const response of Object.values(chunk.chunkData.responses).flat()) {
      if (response.examples.length || !generateResponseExamples) {
        continue;
      }
      // Reset the sample word index for each response
      initRandomSamples();
      response.examples.push({
        name: "Example",
        value: JSON.stringify(
          generateSchemaExample(
            getSchemaFromId(response.contentChunkId, docsData).chunkData.value,
            docsData
          ),
          null,
          "  "
        ),
      });
    }
  }
}

export function generateCodeSamples(
  docsData: Map<string, Chunk>,
  sdkFolders: Map<string, SdkFolder>
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
    if (codeSample.language === "curl") {
      generateCurlCodeSamples(docsData, docsCodeSamples);
      continue;
    }

    // Set up the temp directory for the code sample
    const extractionDir = sdkFolders.get(codeSample.language);
    if (!extractionDir) {
      throw new InternalError(`No SDK folder found for ${codeSample.language}`);
    }

    // Read in the examples
    const examples = readdirSync(join(extractionDir.path, "docs", "sdks"));
    const codeSampleResults: CodeSample[] = [];
    for (const example of examples) {
      codeSampleResults.push(
        ...parseSampleReadme(
          join(extractionDir.path, "docs", "sdks", example, "README.md")
        )
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
      };
    }
  }

  return docsCodeSamples;
}
