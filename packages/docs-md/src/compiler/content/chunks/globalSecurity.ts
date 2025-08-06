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
      ? ` ${renderer.createPillStart("info")}${entry.in}${renderer.createPillEnd()}`
      : "";
    const typePill = entry.type
      ? ` ${renderer.createPillStart("info")}${entry.type}${renderer.createPillEnd()}`
      : "";
    renderer.appendHeading(
      headingLevel,
      `${renderer.escapeText(entry.name, { escape: "markdown" })}${inPill}${typePill}`,
      {
        id: entry.name,
        escape: "none",
      }
    );

    if (entry.description) {
      renderer.appendText(entry.description);
    } else if (showDebugPlaceholders) {
      renderer.appendDebugPlaceholderStart();
      renderer.appendText("No description provided");
      renderer.appendDebugPlaceholderEnd();
    }
  }
}
