import "./wasm_exec.js";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "node:zlib";

import type { Chunk } from "@speakeasy-api/docs-md-shared/types";

declare class Go {
  argv: string[];
  env: Record<string, string>;
  exit: (code: number) => void;
  importObject: WebAssembly.Imports;
  exited: boolean;
  mem: DataView;
  run(instance: WebAssembly.Instance): Promise<void>;
}

const wasmPath = join(dirname(fileURLToPath(import.meta.url)), "lib.wasm.gz");

export async function getData(
  specContents: string
): Promise<Map<string, Chunk>> {
  const gzippedBuffer = await readFile(wasmPath);
  const wasmBuffer = unzipSync(gzippedBuffer);
  const go = new Go();
  // There are two overloads for WebAssembly.instantiate, and for some reason
  // TypeScript is picking the wrong one (which doesn't return the correct
  // type we actually get returned). By forcing the overload, we get the correct
  // type.
  const { instance } = await WebAssembly.instantiate(
    wasmBuffer as BufferSource,
    go.importObject
  );

  // For whatever bizarre reason, awaiting this promise causes a crash.
  void go.run(instance);
  const serializedDocsData = await SerializeDocsData(specContents);

  const docsData = (JSON.parse(serializedDocsData) as string[]).map(
    (chunk) => JSON.parse(chunk) as Chunk
  );

  return new Map(docsData.map((chunk) => [chunk.id, chunk]));
}
