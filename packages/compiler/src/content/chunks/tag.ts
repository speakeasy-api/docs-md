import type { TagChunk } from "@speakeasy-api/docs-md-shared";
import { capitalCase } from "change-case";

import type { Renderer } from "../../renderers/base.ts";
import { getSettings } from "../../settings.ts";
import { HEADINGS } from "../constants.ts";

export function renderTag(renderer: Renderer, chunk: TagChunk) {
  const { name, description } = chunk.chunkData;
  const { showDebugPlaceholders } = getSettings().display;
  renderer.createTagSection({
    title: () => {
      renderer.createHeading(
        HEADINGS.PAGE_TITLE_HEADING_LEVEL,
        `${capitalCase(name)} Endpoints`
      );
    },
    description:
      description || showDebugPlaceholders
        ? () => {
            if (description) {
              renderer.createText(description);
            } else if (showDebugPlaceholders) {
              renderer.createDebugPlaceholder({
                createTitle() {
                  renderer.createText("No tag description provided");
                },
                createExample() {
                  renderer.createCode(
                    `tags:
  - name: ${name.replace("/", ".")}
    description: My awesome description`,
                    {
                      variant: "default",
                      style: "block",
                    }
                  );
                },
              });
            }
          }
        : undefined,
  });
}
