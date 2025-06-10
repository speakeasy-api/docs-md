import type { TagChunk } from "../../../types/chunk.ts";
import type { Renderer } from "../renderer.ts";

export function renderTag(renderer: Renderer, chunk: TagChunk) {
  renderer.appendHeading(1, chunk.chunkData.name);
}
