import type { Renderer } from "../../../renderers/base/base.ts";
import type { AboutChunk } from "../../../types/chunk.ts";
import { HEADINGS } from "../constants.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  renderer.appendHeading(
    HEADINGS.PAGE_TITLE_HEADING_LEVEL,
    `About ${chunk.chunkData.title}`
  );
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
