import { capitalCase, snakeCase } from "change-case";

import type { Renderer, Site } from "../../renderers/base/base.ts";
import type { Chunk, SchemaChunk, TagChunk } from "../../types/chunk.ts";
import { InternalError } from "../../util/internalError.ts";
import { getSettings } from "../../util/settings.ts";
import type { DocsCodeSnippets } from "../codeSnippets/generateCodeSnippets.ts";
import { renderAbout } from "./chunks/about.ts";
import { renderOperation } from "./chunks/operation.ts";
import {
  renderSchemaDetails,
  renderSchemaFrontmatter,
} from "./chunks/schema.ts";
import { renderTag } from "./chunks/tag.ts";
import { HEADINGS } from "./constants.ts";
import { getOperationFromId } from "./util.ts";

type Data = Map<string, Chunk>;

type PageMapEntry =
  | {
      type: "chunk";
      sidebarLabel: string;
      sidebarPosition: string;
      chunks: Chunk[];
    }
  | {
      type: "renderer";
      sidebarLabel: string;
      sidebarPosition: string;
      renderer: (renderer: Renderer) => void;
    };

type PageMap = Map<string, PageMapEntry>;

function getPageMap(site: Site, data: Data) {
  const settings = getSettings();

  const pageMap: PageMap = new Map();

  // Get the about page
  for (const [, chunk] of data) {
    if (chunk.chunkType === "about") {
      pageMap.set(site.buildPagePath("", { appendIndex: true }), {
        type: "chunk",
        sidebarLabel: "About",
        sidebarPosition: "1",
        chunks: [chunk],
      });
    }
  }

  // Find the tag pages
  const tagChunks: TagChunk[] = [];
  for (const [, chunk] of data) {
    if (chunk.chunkType === "tag") {
      tagChunks.push(chunk);
    }
  }

  // Sort by slug so that the sidebar position is stable
  tagChunks.sort((a, b) => a.slug.localeCompare(b.slug));

  // Render the tag pages
  let tagIndex = 0;
  for (const chunk of tagChunks) {
    const pagePath = site.buildPagePath(chunk.slug);
    const pageMapEntry: PageMapEntry = {
      type: "chunk",
      sidebarLabel: capitalCase(chunk.chunkData.name),
      sidebarPosition: `2.${tagIndex++}`,
      chunks: [chunk],
    };
    pageMap.set(pagePath, pageMapEntry);
    for (const operationChunkId of chunk.chunkData.operationChunkIds) {
      const operationChunk = getOperationFromId(operationChunkId, data);
      pageMapEntry.chunks.push(operationChunk);
    }
  }

  // Create the schema pages, if they're enabled in settings
  if (settings.display.showSchemasInNav) {
    // Find the schema chunks
    const schemaChunks: SchemaChunk[] = [];
    for (const [, chunk] of data) {
      if (
        chunk.chunkType === "schema" &&
        chunk.chunkData.value.type === "object" &&
        // We make sure there's a slug so that we're not showing an unnamed or
        // internal schema
        chunk.slug
      ) {
        schemaChunks.push(chunk);
      }
    }

    // Sort by slug so that the sidebar position is stable
    schemaChunks.sort((a, b) => a.slug.localeCompare(b.slug));

    // Render the schema pages
    let schemaIndex = 0;
    for (const chunk of schemaChunks) {
      // This can't happen cause we filter above, but TypeScript doesn't know that
      if (chunk.chunkData.value.type !== "object") {
        throw new InternalError(
          `Schema chunk ${chunk.chunkData.value.type} is not an object`
        );
      }
      const pagePath = site.buildPagePath(chunk.slug);
      const pageMapEntry: PageMapEntry = {
        type: "chunk",
        sidebarLabel: capitalCase(chunk.chunkData.value.name),
        sidebarPosition: `3.${schemaIndex++}`,
        chunks: [chunk] as Chunk[],
      };
      pageMap.set(pagePath, pageMapEntry);
    }
  }

  return pageMap;
}

function renderPages(
  site: Site,
  pageMap: PageMap,
  data: Map<string, Chunk>,
  docsCodeSnippets: DocsCodeSnippets
) {
  for (const [currentPagePath, pageMapEntry] of pageMap) {
    if (pageMapEntry.type === "renderer") {
      const renderer = site.createPage(currentPagePath);
      renderer.insertFrontMatter({
        sidebarPosition: pageMapEntry.sidebarPosition,
        sidebarLabel: pageMapEntry.sidebarLabel,
      });
      pageMapEntry.renderer(renderer);
      continue;
    }
    const { chunks, sidebarLabel, sidebarPosition } = pageMapEntry;
    const renderer = site.createPage(currentPagePath);
    renderer.insertFrontMatter({
      sidebarPosition,
      sidebarLabel,
    });
    for (const chunk of chunks) {
      switch (chunk.chunkType) {
        case "about": {
          renderAbout(renderer, chunk);
          break;
        }
        case "tag": {
          renderTag(renderer, chunk);
          break;
        }
        case "schema": {
          // The normal schema renderer doesn't render a heading, since it's
          // normally embedded in a separate page. It's not in this case though,
          // so we add one by hand
          const id = `schema-${snakeCase(chunk.chunkData.name)}`;
          renderer.appendHeading(
            HEADINGS.SECTION_TITLE_HEADING_LEVEL,
            chunk.chunkData.name,
            {
              id,
            }
          );
          const schemaContext = {
            site,
            renderer,
            schemaStack: [],
            idPrefix: id,
            data,
          };
          renderSchemaFrontmatter({
            context: schemaContext,
            schema: chunk.chunkData.value,
          });
          renderSchemaDetails({
            context: schemaContext,
            schema: chunk.chunkData.value,
          });
          break;
        }
        case "operation": {
          renderOperation({
            renderer,
            site,
            chunk,
            docsData: data,
            docsCodeSnippets,
          });
          break;
        }
        default: {
          // Just a little extra checking. We do all this any typing cause
          // TypeScript is narrowing the type of `chunk` to `never`, but we're
          // really checking in case the types are wrong (cause they're out of
          // date or something) and we know it's an object with a property
          // called `chunkType`. This is why we don't use `assertNever` here
          throw new InternalError(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            `Unknown chunk type: ${(chunk as any).chunkType}`
          );
        }
      }
    }
  }
}

export function renderContent(
  site: Site,
  data: Data,
  docsCodeSnippets: DocsCodeSnippets
) {
  const pageMap = getPageMap(site, data);
  renderPages(site, pageMap, data, docsCodeSnippets);
  return site.render();
}
