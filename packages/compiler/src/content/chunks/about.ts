import type { AboutChunk } from "@speakeasy-api/docs-md-shared";

import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base.ts";
import { getSettings } from "../../settings.ts";
import { HEADINGS } from "../constants.ts";

export function renderAbout(renderer: Renderer, chunk: AboutChunk) {
  debug(`Rendering about chunk`);
  const {
    display: { showDebugPlaceholders },
    output: { singlePage },
  } = getSettings();
  renderer.createHeading(
    HEADINGS.PAGE_TITLE_HEADING_LEVEL,
    singlePage ? chunk.chunkData.title : `About ${chunk.chunkData.title}`
  );
  if (chunk.chunkData.version) {
    renderer.createText(`_Version: ${chunk.chunkData.version}_`);
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholder({
      createTitle() {
        renderer.createText("No version provided");
      },
      createExample() {
        renderer.createCode("info:\n  version: 1.0.0", {
          variant: "default",
          style: "block",
        });
      },
    });
  }
  if (chunk.chunkData.description) {
    renderer.createText(chunk.chunkData.description);
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholder({
      createTitle() {
        renderer.createText("No description provided");
      },
      createExample() {
        renderer.createCode("info:\n  description: My awesome description", {
          variant: "default",
          style: "block",
        });
      },
    });
  }
  if (chunk.chunkData.servers.length > 0) {
    renderer.createText("Servers");
    renderer.createList(chunk.chunkData.servers.map((server) => server.url));
  } else if (showDebugPlaceholders) {
    renderer.createDebugPlaceholder({
      createTitle() {
        renderer.createText("No servers provided");
      },
      createExample() {
        renderer.createCode("servers:\n  - url: https://api.example.com", {
          variant: "default",
          style: "block",
        });
      },
    });
  }
}
