import { capitalCase } from "change-case";

import type { TagChunk } from "../../../types/chunk.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import { HEADINGS } from "../constants.ts";

export function renderTag(renderer: Renderer, chunk: TagChunk) {
  const displayName = `${capitalCase(chunk.chunkData.name)} Operations`;
  renderer.appendHeading(HEADINGS.PAGE_TITLE_HEADING_LEVEL, displayName, {
    id: chunk.chunkData.name,
  });
}
