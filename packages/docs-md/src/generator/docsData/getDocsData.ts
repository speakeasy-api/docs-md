import "./wasm_exec.js";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "node:zlib";

import type { Chunk } from "../../types/chunk.ts";

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
  const docsData = (JSON.parse(serializedDocsData) as string[]).map(
    (chunk) => JSON.parse(chunk) as Chunk
  );
  return new Map(docsData.map((chunk) => [chunk.id, chunk]));
}
