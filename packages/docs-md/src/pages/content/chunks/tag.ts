import type { Renderer } from "../../../renderers/base/renderer.ts";
import type { TagChunk } from "../../../types/chunk.ts";

export function renderTag(renderer: Renderer, chunk: TagChunk) {
  renderer.appendHeading(1, chunk.chunkData.name);
}
