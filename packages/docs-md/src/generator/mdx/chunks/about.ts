import type { AboutChunk } from "../../../types/chunk.ts";
import type { Renderer } from "../renderer.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  renderer.appendHeading(1, `About ${chunk.chunkData.title}`);
  if (chunk.chunkData.version) {
    renderer.appendParagraph(`_Version: ${chunk.chunkData.version}_`);
  }
  if (chunk.chunkData.description) {
    renderer.appendParagraph(chunk.chunkData.description);
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.appendParagraph("Servers");
    renderer.appendList(chunk.chunkData.servers.map((server) => server.url));
  }
}
