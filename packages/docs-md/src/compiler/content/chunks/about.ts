import type { AboutChunk } from "../../../types/chunk.ts";
import { getSettings } from "../.././settings.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import { debug } from "../../logging.ts";
import { HEADINGS } from "../constants.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  debug(`Rendering about chunk`);
  const { showDebugPlaceholders } = getSettings().display;
  renderer.createHeading(
    HEADINGS.PAGE_TITLE_HEADING_LEVEL,
    `About ${chunk.chunkData.title}`
  );
  if (chunk.chunkData.version) {
    renderer.createText(`_Version: ${chunk.chunkData.version}_`);
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholderStart();
    renderer.createText("No version provided");
    renderer.createDebugPlaceholderEnd();
  }
  if (chunk.chunkData.description) {
    renderer.createText(chunk.chunkData.description);
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholderStart();
    renderer.createText("No description provided");
    renderer.createDebugPlaceholderEnd();
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.createText("Servers");
    renderer.createList(chunk.chunkData.servers.map((server) => server.url));
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.createText("No servers provided");
    renderer.appendDebugPlaceholderEnd();
  }
}
