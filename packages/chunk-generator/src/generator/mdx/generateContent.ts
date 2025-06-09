import { join, resolve } from "node:path";

import type { Chunk } from "../../types/chunk.ts";
import type { Settings } from "../../types/settings.ts";
import { renderAbout } from "./chunks/about.ts";
import { renderOperation } from "./chunks/operation.ts";
import { renderSchema } from "./chunks/schema.ts";
import { renderTag } from "./chunks/tag.ts";
import { Site } from "./renderer.ts";
import { getOperationFromId } from "./util.ts";

type GenerateContentOptions = {
  data: Map<string, Chunk>;
  settings: Settings;
};

type PageMap = Map<
  string,
  { sidebarLabel: string; sidebarPosition: string; chunks: Chunk[] }
>;

function getPageMap({ data, settings }: GenerateContentOptions) {
  const pageMap: PageMap = new Map();

  let buildPagePath: (slug: string) => string;
  switch (settings.output.framework) {
    case "docusaurus": {
      buildPagePath = (slug: string) =>
        resolve(join(settings.output.pageOutDir, `${slug}.mdx`));
      break;
    }
    case "nextra": {
      buildPagePath = (slug: string) =>
        resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
      break;
    }
    // We don't need a default check here cause we already did it above via Zod
  }

  // Get the about page
  for (const [, chunk] of data) {
    if (chunk.chunkType === "about") {
      pageMap.set(buildPagePath("about"), {
        sidebarLabel: "About",
        sidebarPosition: "1",
        chunks: [chunk],
      });
    }
  }

  // Find the tag pages
  let tagIndex = 0;
  const tagChunks: Chunk[] = [];
  for (const [, chunk] of data) {
    if (chunk.chunkType === "tag") {
      tagChunks.push(chunk);
    }
  }

  // Sort by slug so that the sidebar position is stable
  tagChunks.sort((a, b) => a.slug.localeCompare(b.slug));
  for (const chunk of tagChunks) {
    // This is impossible due to the sort above, but TypeScript doesn't know that
    if (chunk.chunkType !== "tag") {
      throw new Error(`Expected tag chunk, got ${chunk.chunkType}`);
    }
    const pagePath = buildPagePath(chunk.slug);
    const pageMapEntry = {
      sidebarLabel: chunk.chunkData.name,
      sidebarPosition: `2.${tagIndex++}`,
      chunks: [chunk] as Chunk[],
    };
    pageMap.set(pagePath, pageMapEntry);
    for (const operationChunkId of chunk.chunkData.operationChunkIds) {
      const operationChunk = getOperationFromId(operationChunkId, data);
      pageMapEntry.chunks.push(operationChunk);
    }
  }

  // TODO: Mistral doesn't want schemas/refs in the sidebar (fair), but others
  // might so eventually we should control this with a config file value and
  // search for schemas to add to the pagemap here

  return pageMap;
}

function renderPages(site: Site, pageMap: PageMap, data: Map<string, Chunk>) {
  for (const [
    currentPagePath,
    { chunks, sidebarLabel, sidebarPosition },
  ] of pageMap) {
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
          renderer.appendHeading(1, chunk.chunkData.name);
          renderSchema({
            renderer,
            site,
            schema: chunk.chunkData.value,
            data,
            baseHeadingLevel: 1,
            topLevelName: "Schema",
            depth: 0,
          });
          break;
        }
        case "operation": {
          renderOperation({
            renderer,
            site,
            chunk,
            docsData: data,
            baseHeadingLevel: 2,
          });
          break;
        }
        default: {
          // Just a little extra checking. We do all this any typing cause TypeScript
          // is narrowing the type to `never`, but we're really checking in case
          // the types are wrong (cause they're out of date or something)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          throw new Error(`Unknown chunk type: ${(chunk as any).chunkType}`);
        }
      }
    }
    renderer.finalize();
  }
}

function renderScaffoldSupport(site: Site, settings: Settings) {
  switch (settings.output.framework) {
    case "docusaurus": {
      site.createRawPage(
        join(settings.output.pageOutDir, "_category_.json"),
        JSON.stringify(
          {
            position: 2,
            label: "API Reference",
            collapsible: true,
            collapsed: false,
          },
          null,
          "  "
        )
      );
      site.createRawPage(
        join(settings.output.pageOutDir, "tag", "_category_.json"),
        JSON.stringify(
          {
            position: 3,
            label: "Operations",
            collapsible: true,
            collapsed: false,
          },
          null,
          "  "
        )
      );
      break;
    }
    case "nextra": {
      // Nextra doesn't need anything (yet)
      break;
    }
  }
}

export function generateContent({
  data,
  settings,
}: GenerateContentOptions): Record<string, string> {
  // First, get a mapping of pages to chunks
  const pageMap = getPageMap({ data, settings });

  // Then, render each page
  const site = new Site({ baseComponentPath: settings.output.componentOutDir });
  renderPages(site, pageMap, data);

  // Now do any post-processing needed by the scaffold
  renderScaffoldSupport(site, settings);

  // Finally, return the pages
  return Object.fromEntries(site.getPages());
}
