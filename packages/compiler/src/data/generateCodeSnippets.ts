import { basename } from "node:path";
import { promisify } from "node:util";
import { gunzip as gunzipCallback, inflateRaw } from "node:zlib";

import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";

import { error, info } from "../logging.ts";
import type { CodeSampleConfig, CodeSampleLanguage } from "../settings.ts";
import {
  getSettings,
  isCodeSampleConfig,
  isCodeSampleLanguage,
} from "../settings.ts";

type CodeSnippet = {
  operationId: string;
  language: string;
  code: string;

  // This property isn't returned from the API, but we need it for other uses
  // and have it as part of forming the request
  packageName?: string;
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
  Partial<Record<CodeSampleLanguage, CodeSnippet>>
>;

const inflateRawAsync = promisify(inflateRaw);
const gunzipAsync = promisify(gunzipCallback);

export async function generateCodeSnippets(
  docsData: Map<string, Chunk>,
  specContents: string
): Promise<DocsCodeSnippets> {
  const { spec, codeSamples } = getSettings();
  if (!codeSamples) {
    info("Code samples not enabled, skipping code snippets generation");
    return {};
  }

  const specFilename = spec && basename(spec);

  const operationChunksByOperationId = buildOperationChunkIndex(docsData);

  try {
    const codeSampleEntries = codeSamples ?? [];

    const apiConfigs = codeSampleEntries.filter(
      (entry): entry is CodeSampleConfig => isCodeSampleConfig(entry)
    );
    const archiveUrls = codeSampleEntries.filter(isCodeSampleUrl);

    const [apiSnippets, archiveSnippets] = await Promise.all([
      fetchSnippetsFromApi({
        codeSampleConfigs: apiConfigs,
        specContents,
        specFilename,
      }),
      fetchSnippetsFromArchives(archiveUrls),
    ]);

    const codeSnippets = [...apiSnippets, ...archiveSnippets];

    return mapSnippetsToDocsCodeSnippets(
      codeSnippets,
      operationChunksByOperationId
    );
  } catch (err) {
    error(`There was an error generating code snippets`, err);
    return {};
  }
}

function buildOperationChunkIndex(
  docsData: Map<string, Chunk>
): Map<string, OperationChunk> {
  const operationChunksByOperationId = new Map<string, OperationChunk>();
  for (const chunk of docsData.values()) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }
  return operationChunksByOperationId;
}

async function fetchSnippetsFromApi({
  codeSampleConfigs,
  specContents,
  specFilename,
}: {
  codeSampleConfigs: CodeSampleConfig[];
  specContents: string;
  specFilename?: string;
}): Promise<CodeSnippet[]> {
  if (codeSampleConfigs.length === 0) {
    return [];
  }
  const snippets: CodeSnippet[] = [];

  for (const sampleConfig of codeSampleConfigs) {
    const formData = new FormData();
    const blob = new Blob([specContents]);
    formData.append("language", sampleConfig.language);
    if (specFilename) {
      formData.append("schema_file", blob, specFilename);
    } else {
      formData.append("schema_file", blob);
    }
    formData.append("package_name", sampleConfig.packageName);
    formData.append("sdk_class_name", sampleConfig.sdkClassName);

    const res = await fetch(
      `${CODE_SNIPPETS_API_URL}/v1/code_sample/preview`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = (await res.json()) as unknown;

    if (!res.ok) {
      const errorResponse = json as ErrorResponse;
      throw new Error(
        `Failed to generate code sample: ${errorResponse.message}`
      );
    }

    const codeSampleResponses = (json as CodeSamplesResponse).snippets.map(
      (snippet) => ({
        ...snippet,
        packageName: sampleConfig.packageName,
      })
    );

    snippets.push(...codeSampleResponses);
  }

  return snippets;
}

async function fetchSnippetsFromArchives(
  urls: string[]
): Promise<CodeSnippet[]> {
  if (urls.length === 0) {
    return [];
  }

  const snippets: CodeSnippet[] = [];

  for (const url of urls) {
    const archiveSnippets = await fetchSnippetsFromArchive(url);
    snippets.push(...archiveSnippets);
  }

  return snippets;
}

async function fetchSnippetsFromArchive(url: string): Promise<CodeSnippet[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download code sample archive from ${url}: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const lowerCaseUrl = url.toLowerCase();

  let files: Map<string, Buffer>;

  if (lowerCaseUrl.endsWith(".zip")) {
    files = await extractZip(buffer);
  } else if (
    lowerCaseUrl.endsWith(".tar.gz") ||
    lowerCaseUrl.endsWith(".tgz")
  ) {
    files = await extractTarGz(buffer);
  } else {
    throw new Error(`Unsupported code sample archive format for ${url}`);
  }

  const snippets: CodeSnippet[] = [];

  for (const [path, fileBuffer] of files) {
    if (!path.toLowerCase().endsWith(".md")) {
      continue;
    }

    const markdown = fileBuffer.toString("utf8");
    snippets.push(...parseUsageSnippetsFromMarkdown(markdown));
  }

  return snippets;
}

function parseUsageSnippetsFromMarkdown(markdown: string): CodeSnippet[] {
  const snippets: CodeSnippet[] = [];
  const usageSnippetRegex = /<!--\s*UsageSnippet\s+([^>]+?)\s*-->\s*```([^\n\r]*)\r?\n([\s\S]*?)```/g;

  let match: RegExpExecArray | null;
  while ((match = usageSnippetRegex.exec(markdown)) !== null) {
    const [, rawAttributes, fencedLanguage, codeBlock] = match;
    const attributes = parseAttributes(rawAttributes);
    const operationId = (attributes.operationID ?? attributes.operationId)?.trim();
    const languageValue = (attributes.language ?? fencedLanguage)?.trim();

    if (!operationId || !languageValue) {
      continue;
    }

    const normalizedLanguage = languageValue.toLowerCase();
    const code = codeBlock.replace(/[\r\n]+$/, "");

    snippets.push({
      operationId,
      language: normalizedLanguage,
      code,
    });
  }

  return snippets;
}

function parseAttributes(rawAttributes: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attributeRegex = /([A-Za-z0-9_:-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = attributeRegex.exec(rawAttributes)) !== null) {
    const [, key, value] = match;
    attributes[key] = value;
  }

  return attributes;
}

async function extractTarGz(buffer: Buffer): Promise<Map<string, Buffer>> {
  const files = new Map<string, Buffer>();
  const decompressed = await gunzipAsync(buffer);

  let offset = 0;
  let pendingLongName: string | undefined;

  while (offset < decompressed.length) {
    const header = decompressed.subarray(offset, offset + 512);
    offset += 512;

    if (header.every((byte) => byte === 0)) {
      break;
    }

    const rawName = header.toString("utf8", 0, 100).replace(/\0.*$/, "");
    const typeFlag = header.toString("utf8", 156, 157);
    const sizeOctal = header.toString("utf8", 124, 136).replace(/\0.*$/, "");
    const size = parseInt(sizeOctal || "0", 8);

    if (Number.isNaN(size) || size < 0) {
      throw new Error(`Invalid tar entry size for ${rawName || "unknown"}`);
    }

    const content = decompressed.subarray(offset, offset + size);
    offset += size;

    const padding = (512 - (size % 512)) % 512;
    offset += padding;

    if (typeFlag === "L") {
      pendingLongName = content.toString("utf8").replace(/\0.*$/, "");
      continue;
    }

    const name = pendingLongName ?? rawName;
    pendingLongName = undefined;

    if (!name || name.endsWith("/")) {
      continue;
    }

    files.set(name, Buffer.from(content));
  }

  return files;
}

async function extractZip(buffer: Buffer): Promise<Map<string, Buffer>> {
  const files = new Map<string, Buffer>();
  const eocdSignature = 0x06054b50;
  const centralDirectorySignature = 0x02014b50;
  const localFileHeaderSignature = 0x04034b50;

  let eocdOffset = buffer.length - 22;
  while (eocdOffset >= 0 && buffer.readUInt32LE(eocdOffset) !== eocdSignature) {
    eocdOffset -= 1;
  }

  if (eocdOffset < 0) {
    throw new Error("Failed to locate end of central directory in zip archive");
  }

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);

  let currentOffset = centralDirectoryOffset;

  for (let index = 0; index < totalEntries; index += 1) {
    if (buffer.readUInt32LE(currentOffset) !== centralDirectorySignature) {
      throw new Error("Invalid central directory file header in zip archive");
    }

    const compressionMethod = buffer.readUInt16LE(currentOffset + 10);
    const compressedSize = buffer.readUInt32LE(currentOffset + 20);
    const fileNameLength = buffer.readUInt16LE(currentOffset + 28);
    const extraFieldLength = buffer.readUInt16LE(currentOffset + 30);
    const fileCommentLength = buffer.readUInt16LE(currentOffset + 32);
    const localHeaderOffset = buffer.readUInt32LE(currentOffset + 42);

    const fileName = buffer
      .slice(currentOffset + 46, currentOffset + 46 + fileNameLength)
      .toString("utf8");

    const localHeaderSignature = buffer.readUInt32LE(localHeaderOffset);

    if (localHeaderSignature !== localFileHeaderSignature) {
      throw new Error("Invalid local file header in zip archive");
    }

    const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraFieldLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart =
      localHeaderOffset +
      30 +
      localFileNameLength +
      localExtraFieldLength;

    const compressedData = buffer.slice(
      dataStart,
      dataStart + compressedSize
    );

    let fileBuffer: Buffer;

    if (compressionMethod === 0) {
      fileBuffer = Buffer.from(compressedData);
    } else if (compressionMethod === 8) {
      fileBuffer = await inflateRawAsync(compressedData);
    } else {
      throw new Error(
        `Unsupported zip compression method: ${compressionMethod}`
      );
    }

    if (!fileName.endsWith("/")) {
      files.set(fileName, fileBuffer);
    }

    currentOffset +=
      46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return files;
}

function mapSnippetsToDocsCodeSnippets(
  codeSnippets: CodeSnippet[],
  operationChunksByOperationId: Map<string, OperationChunk>
): DocsCodeSnippets {
  const docsCodeSnippets: DocsCodeSnippets = {};

  for (const snippet of codeSnippets) {
    if (!isCodeSampleLanguage(snippet.language)) {
      continue;
    }

    const chunk = operationChunksByOperationId.get(snippet.operationId);
    if (!chunk) {
      continue;
    }

    docsCodeSnippets[chunk.id] ??= {};
    docsCodeSnippets[chunk.id]![snippet.language] = snippet;
  }

  return docsCodeSnippets;
}

function isCodeSampleUrl(value: unknown): value is string {
  return typeof value === "string";
}
