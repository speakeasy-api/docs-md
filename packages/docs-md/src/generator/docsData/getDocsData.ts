import "./wasm_exec.js";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "node:zlib";

import type { Chunk } from "../../types/chunk.ts";
import type { AST } from "../../types/global.js";

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
  specContents: string
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
  
  const snippets = await getDocsSnippets(specContents, 'typescriptv2');

  console.log(snippets);
  const docsData = (JSON.parse(serializedDocsData) as string[]).map(
    (chunk) => JSON.parse(chunk) as Chunk
  );
  return new Map(docsData.map((chunk) => [chunk.id, chunk]));
}


async function getDocsSnippets(
  schema: string,
  target: string,
): Promise<unknown> {
  const gzippedBuffer = await readFile(wasmPath);
  const wasmBuffer = unzipSync(gzippedBuffer);
  try {
  const go = new Go();

  const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
  
    void go.run(result.instance);

    const serializedAstString = await SerializeSandboxAST([schema]);
    const serializedAst = JSON.parse(serializedAstString) as AST;

    const operationIds = serializedAst.operations.map((operation) => operation.operationID);

    const usageSnippetsData = await GenerateUsageSnippets([{
      schema,
      operationIds,
      target,
      config: {
        packageName: serializedAst.docInfo.title,
        sdkClassName: serializedAst.docInfo.title,
      },
    }]);
    
    return usageSnippetsData;
  } catch (e: unknown) {
    console.log("error", e);
    return null;
  }
}
