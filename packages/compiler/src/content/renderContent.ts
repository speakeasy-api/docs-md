import type {
  Chunk,
  PageMetadata,
  TagChunk,
} from "@speakeasy-api/docs-md-shared";
import { capitalCase } from "change-case";

import type { FrameworkConfig } from "../compiler.ts";
import type { CodeSamples } from "../data/generateCodeSamples.ts";
import { debug } from "../logging.ts";
import type { Site } from "../renderers/base.ts";
import { getInternalSetting, getSettings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";
import { renderAbout } from "./chunks/about.ts";
import { renderGlobalSecurity } from "./chunks/globalSecurity.ts";
import { renderOperation } from "./chunks/operation.ts";
import { renderTag } from "./chunks/tag.ts";
import { HEADINGS } from "./constants.ts";
import { getOperationFromId } from "./util.ts";

type Data = Map<string, Chunk>;

type PageMapEntryChunk = {
  contextChunk?: Chunk;
  chunk: Chunk;
};

type PageMapEntry = {
  slug: string;
  sidebarLabel: string;
  sidebarPosition: string;
  chunks: PageMapEntryChunk[];
};

type PageMap = Map<string, PageMapEntry>;

function getAboutChunk(data: Data) {
  for (const [, chunk] of data) {
    if (chunk.chunkType === "about") {
      return chunk;
    }
  }
  throw new InternalError("About chunk not found");
}

function getGlobalSecurityChunk(data: Data) {
  for (const [, chunk] of data) {
    if (chunk.chunkType === "globalSecurity") {
      return chunk;
    }
  }
  throw new InternalError("Global security chunk not found");
}

function getPageMap(site: Site, data: Data) {
  const pageMap: PageMap = new Map();
  const { aboutPage, singlePage } = getSettings().output;

  // If we're in single page mode, we attach all chunks to a single, root-level entry
  if (singlePage) {
    const chunks: PageMapEntryChunk[] = [];

    // Now get the tag chunks and add them to the list
    for (const [, chunk] of data) {
      if (chunk.chunkType === "tag") {
        chunks.push({ chunk: chunk });
        for (const operationChunkId of chunk.chunkData.operationChunkIds) {
          const operationChunk = getOperationFromId(operationChunkId, data);
          chunks.push({ chunk: operationChunk, contextChunk: chunk });
        }
      }
    }

    // Sort by slug so that the sidebar position is stable
    chunks.sort((a, b) => a.chunk.slug.localeCompare(b.chunk.slug));

    // Check if the about page content is enabled, and if so add about and
    // global security chunks to the list
    if (aboutPage) {
      chunks.unshift(
        { chunk: getAboutChunk(data) },
        { chunk: getGlobalSecurityChunk(data) }
      );
    }

    // Finally, create the page entry with all collected chunks
    pageMap.set(site.buildPagePath("", { appendIndex: true }), {
      slug: "",
      sidebarLabel: "API Reference",
      sidebarPosition: "1",
      chunks,
    });
  }

  // If we're not in single page mode, we create a page for about and one for each tag
  else {
    // Create the about page, if enabled
    if (aboutPage) {
      pageMap.set(site.buildPagePath("", { appendIndex: true }), {
        slug: "",
        sidebarLabel: "About",
        sidebarPosition: "1",
        chunks: [
          { chunk: getAboutChunk(data) },
          { chunk: getGlobalSecurityChunk(data) },
        ],
      });
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
        slug: chunk.slug,
        sidebarLabel: capitalCase(chunk.chunkData.name),
        sidebarPosition: `3.${tagIndex++}`,
        chunks: [{ chunk: chunk }],
      };
      pageMap.set(pagePath, pageMapEntry);
      for (const operationChunkId of chunk.chunkData.operationChunkIds) {
        const operationChunk = getOperationFromId(operationChunkId, data);
        pageMapEntry.chunks.push({
          chunk: operationChunk,
          contextChunk: chunk,
        });
      }
    }
  }

  return pageMap;
}

function renderPages(
  site: Site,
  frameworkConfig: FrameworkConfig,
  pageMap: PageMap,
  docsCodeSamples: CodeSamples
) {
  const pageMetadata: PageMetadata[] = [];
  for (const [currentPagePath, pageMapEntry] of pageMap) {
    debug(`Rendering page ${currentPagePath}`);
    const { chunks, sidebarLabel, sidebarPosition, slug } = pageMapEntry;
    const renderer = site.createPage(currentPagePath, slug, {
      sidebarPosition,
      sidebarLabel,
    });
    const settings = getSettings();
    for (const { chunk, contextChunk } of chunks) {
      switch (chunk.chunkType) {
        case "about": {
          renderAbout(renderer, chunk);
          break;
        }
        case "globalSecurity": {
          renderer.createHeading(
            HEADINGS.SECTION_TITLE_HEADING_LEVEL,
            "Global Security"
          );
          renderGlobalSecurity(renderer, chunk);
          break;
        }
        case "tag": {
          // TODO: when we're in single page mode, we don't have a proper
          // level to render tags, because the page is <h1> and endpoints are
          // <h2>, leaving no gap in between.
          if (!settings.output.singlePage) {
            renderTag(renderer, chunk);
          }
          break;
        }
        case "operation": {
          if (contextChunk?.chunkType !== "tag") {
            throw new InternalError("Context chunk not found");
          }
          renderOperation({
            tagChunk: contextChunk,
            renderer,
            chunk,
            docsCodeSamples,
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
    const { contents, metadata } = renderer.render();
    if (metadata) {
      pageMetadata.push(metadata);
    }
    getInternalSetting("onPageComplete")(currentPagePath, contents);
  }
  frameworkConfig.postProcess?.(pageMetadata);
}

export function renderContent(
  site: Site,
  frameworkConfig: FrameworkConfig,
  data: Data,
  docsCodeSamples: CodeSamples
) {
  const pageMap = getPageMap(site, data);
  renderPages(site, frameworkConfig, pageMap, docsCodeSamples);
}
