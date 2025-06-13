import "./wasm_exec.js";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "node:zlib";

import type { Chunk } from "../../types/chunk.ts";
import type { AST } from "../../types/usageSnippets.ts";
import { fetchCodeSnippets as fetchUsageSnippets } from "../generateCodeSnippets.ts";
declare class Go {
  argv: string[];
  env: { [envKey: string]: string };
  exit: (code: number) => void;
  importObject: WebAssembly.Imports;
  exited: boolean;
  mem: DataView;
  run(instance: WebAssembly.Instance): Promise<void>;
}

const wasmPath = join(dirname(fileURLToPath(import.meta.url)), "lib.wasm.gz");

export async function getDocsData(
  specContents: string,
  specFilename: string
): Promise<Map<string, Chunk>> {
  console.log(
    "Parsing OpenAPI spec (you can ignore lock file errors printed below)"
  );
  const gzippedBuffer = await readFile(wasmPath);
  const wasmBuffer = unzipSync(gzippedBuffer);
  const go = new Go();
  const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
  void go.run(result.instance);
  const serializedDocsData = await SerializeDocsData(specContents);
  const schemaAST = await SerializeSchemaAST(specContents, wasmPath);

  const docsData = (JSON.parse(serializedDocsData) as string[]).map(
    (chunk) => JSON.parse(chunk) as Chunk
  );

  // create a by operationId map of the operation chunks
  const operationChunksByOperationId = new Map<string, Chunk>();
  for (const chunk of docsData) {
    if (chunk.chunkType === "operation") {
      operationChunksByOperationId.set(chunk.chunkData.operationId, chunk);
    }
  }

  const usageSnippets = await fetchUsageSnippets(
    "typescript",
    {
      fileName: specFilename,
      content: specContents,
    },
    Array.from(operationChunksByOperationId.keys()),
    schemaAST.docInfo.title,
    schemaAST.docInfo.title
  );

  for (const snippet of usageSnippets) {
    const chunk = operationChunksByOperationId.get(snippet.operationId);
    if (chunk && chunk.chunkType === "operation") {
      chunk.chunkData.usageSnippet = {...snippet};
    }
  }

  return new Map(docsData.map((chunk) => [chunk.id, chunk]));
}

async function SerializeSchemaAST(schema: string, wasmPath: string): Promise<AST> {
  const gzippedBuffer = await readFile(wasmPath);
  const wasmBuffer = unzipSync(gzippedBuffer);
  const go = new Go();
  const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
  void go.run(result.instance);
  const serializedAstString = await SerializeSandboxAST([schema]);
  const serializedAst = JSON.parse(serializedAstString) as AST;
  return serializedAst;
}