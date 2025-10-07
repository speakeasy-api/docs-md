import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  Chunk,
  OperationChunk,
  SchemaValue,
} from "@speakeasy-api/docs-md-shared";
import { CurlGenerator } from "curl-generator";

import { getSchemaFromId, getSecurityFromId } from "../content/util.ts";
import { error, info } from "../logging.ts";
import { getSettings } from "../settings.ts";
import { assertNever } from "../util/assertNever.ts";
import { InternalError } from "../util/internalError.ts";
import type { SdkFolder } from "./types.ts";

const CODE_SAMPLE_HEADER =
  /^<!-- UsageSnippet language="(.+)" operationID="(.+)" method="(.+)" path="(.+)" -->$/;
const CODE_SAMPLE_START = /^```(.*)$/;
const CODE_SAMPLE_END = /^```$/;

type CodeSample = {
  operationId: string;
  language: string;
  code: string;
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
      return getExplicitValue(schema, "lorem ipsum");
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
      return getExplicitValue(schema, Math.round(Math.random() * 100));
    }
    case "date":
    case "date-time": {
      return getExplicitValue(schema, new Date().toISOString());
    }
    case "null": {
      return null;
    }
    case "any": {
      // Hey, null counts as any, so do the simple thing
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
              case "digest": {
                // TODO
                break;
              }
              case "cookie": {
                // TODO
                break;
              }
            }
            break;
          }
          case "mutualTLS": {
            // TODO
            break;
          }
          case "oauth2": {
            // TODO
            break;
          }
          case "openIdConnect": {
            // TODO
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
