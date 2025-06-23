import type { AboutChunk } from "../../../types/chunk.ts";
import type { Renderer } from "../../../types/renderer.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  renderer.appendHeading(1, `About ${chunk.chunkData.title}`);
  if (chunk.chunkData.version) {
    renderer.appendText(`_Version: ${chunk.chunkData.version}_`);
  }
  if (chunk.chunkData.description) {
    renderer.appendText(chunk.chunkData.description);
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.appendText("Servers");
    renderer.appendList(chunk.chunkData.servers.map((server) => server.url));
  }
}
