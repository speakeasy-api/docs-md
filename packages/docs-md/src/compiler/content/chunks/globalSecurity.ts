import type { GlobalSecurityChunk } from "../../../types/chunk.ts";
import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base/base.ts";
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
      `${renderer.escapeText(entry.name, { escape: "markdown" })}${inPill}${typePill}`,
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
