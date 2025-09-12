import type { GlobalSecurityChunk } from "@speakeasy-api/docs-md-shared/types";

import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base.ts";
import { escapeText } from "../../renderers/util.ts";
import { getSettings } from "../../settings.ts";

export function renderGlobalSecurity(
  renderer: Renderer,
  chunk: GlobalSecurityChunk,
  headingLevel: number
) {
  debug(`Rendering global security chunk`);
  const { showDebugPlaceholders } = getSettings().display;
  for (const entry of chunk.chunkData.entries) {
    const inPill = entry.in
      ? ` ${renderer.createPill("info", () => entry.in)}`
      : "";
    const typePill = entry.type
      ? ` ${renderer.createPill("info", () => entry.type)}`
      : "";
    renderer.createHeading(
      headingLevel,
      `${escapeText(entry.name, { escape: "markdown" })}${inPill}${typePill}`,
      {
        id: entry.name,
        escape: "none",
      }
    );

    if (entry.description) {
      renderer.createText(entry.description);
    } else if (showDebugPlaceholders) {
      renderer.createDebugPlaceholder(() => "No description provided");
    }
  }
}
