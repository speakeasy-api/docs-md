import type { AboutChunk } from "../../../types/chunk.ts";
import { getSettings } from "../.././settings.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import { HEADINGS } from "../constants.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  const { showDebugPlaceholders } = getSettings().display;
  renderer.appendHeading(
    HEADINGS.PAGE_TITLE_HEADING_LEVEL,
    `About ${chunk.chunkData.title}`
  );
  if (chunk.chunkData.version) {
    renderer.appendText(`_Version: ${chunk.chunkData.version}_`);
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No version provided");
    renderer.appendDebugPlaceholderEnd();
  }
  if (chunk.chunkData.description) {
    renderer.appendText(chunk.chunkData.description);
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No description provided");
    renderer.appendDebugPlaceholderEnd();
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.appendText("Servers");
    renderer.appendList(chunk.chunkData.servers.map((server) => server.url));
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No servers provided");
    renderer.appendDebugPlaceholderEnd();
  }
}
