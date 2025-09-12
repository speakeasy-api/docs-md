import type { AboutChunk } from "@speakeasy-api/docs-md-shared/types";

import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base.ts";
import { getSettings } from "../../settings.ts";
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
    renderer.createDebugPlaceholder(() => "No version provided");
  }
  if (chunk.chunkData.description) {
    renderer.createText(chunk.chunkData.description);
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholder(() => "No description provided");
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.createText("Servers");
    renderer.createList(chunk.chunkData.servers.map((server) => server.url));
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholder(() => "No servers provided");
  }
}
