import type { GlobalSecurityChunk } from "@speakeasy-api/docs-md-shared";

import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base.ts";
import { escapeText } from "../../renderers/util.ts";
import { getSettings } from "../../settings.ts";
import { HEADINGS } from "../constants.ts";

export function renderGlobalSecurity(
  renderer: Renderer,
  chunk: GlobalSecurityChunk
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
      HEADINGS.SECTION_HEADING_LEVEL,
      `${escapeText(entry.name, { escape: "markdown" })}${inPill}${typePill}`,
      {
        id: entry.name,
        escape: "none",
      }
    );

    if (entry.description) {
      renderer.createText(entry.description);
    } else if (showDebugPlaceholders) {
      renderer.createDebugPlaceholder({
        createTitle() {
          renderer.createText("No description provided");
        },
        createExample() {
          renderer.createCode(
            "securitySchemes:\n  APIKey:\n    description: My API key description",
            {
              variant: "default",
              style: "block",
            }
          );
        },
      });
    }
  }
}
