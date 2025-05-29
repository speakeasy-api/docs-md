import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Chunk } from "../../types/chunk.ts";
import { renderAbout } from "./chunks/about.ts";
import { renderOperation } from "./chunks/operation.ts";
import { renderSchema } from "./chunks/schema.ts";
import { renderTag } from "./chunks/tag.ts";
import { Renderer } from "./renderer.ts";
import { getOperationFromId } from "./util.ts";

const LOCAL_COMPONENT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "assets"
);

type BaseOptions = {
  data: Map<string, Chunk>;
  basePagePath: string;
};

function getPageMap({
  data,
  basePagePath,
}: BaseOptions): Map<
  string,
  { sidebarLabel: string; sidebarPosition: string; chunks: Chunk[] }
> {
  const pageMap: Map<
    string,
    { sidebarLabel: string; sidebarPosition: string; chunks: Chunk[] }
  > = new Map();

  // let schemaIndex = 0;
  let tagIndex = 0;
  for (const [, chunk] of data) {
    if (!chunk.slug) {
      continue;
    }
    const path = resolve(join(basePagePath, `${chunk.slug}.mdx`));
    switch (chunk.chunkType) {
      case "about": {
        // TODO: eventually we want to make this more configurable, since
        // Docusaurus and Nextra use different formats
        pageMap.set(path, {
          sidebarLabel: "About",
          sidebarPosition: "1",
          chunks: [chunk],
        });
        break;
      }
      case "tag": {
        const chunks: Chunk[] = [chunk];
        pageMap.set(path, {
          sidebarLabel: chunk.chunkData.name,
          sidebarPosition: `2.${tagIndex++}`,
          chunks,
        });
        for (const operationChunkId of chunk.chunkData.operationChunkIds) {
          const operationChunk = getOperationFromId(operationChunkId, data);
          chunks.push(operationChunk);
        }
        break;
      }
      // TODO: Mistral doesn't want this in the sidebar (fair), but others might
      // so eventually we should control this with a config file value
      // case "schema": {
      //   if (chunk.chunkData.name) {
      //     pageMap.set(path, {
      //       sidebarLabel: chunk.chunkData.name,
      //       sidebarPosition: `3.${schemaIndex++}`,
      //       chunks: [chunk],
      //     });
      //   }
      //   break;
      // }
      // We don't look for operations here, cause they're never on their own page
    }
  }

  return pageMap;
}

type GenerateContentOptions = BaseOptions & {
  baseComponentPath: string;
};

export function generateContent({
  data,
  basePagePath,
  baseComponentPath,
}: GenerateContentOptions): Record<string, string> {
  // First, get a mapping of pages to chunks
  const pageMap = getPageMap({ data, basePagePath });

  const renderedChunkMap = new Map<string, string>();
  for (const [
    currentPagePath,
    { chunks, sidebarLabel, sidebarPosition },
  ] of pageMap) {
    const renderer = new Renderer({
      baseComponentPath,
      currentPagePath,
    });
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
            schema: chunk.chunkData.value,
            data,
            baseHeadingLevel: 1,
            topLevelName: "Schema",
            depth: 0,
          });
          break;
        }
        case "operation": {
          renderOperation(renderer, chunk, data, {
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
    renderedChunkMap.set(currentPagePath, renderer.render());
  }

  // Attach the assets
  const assetFileList = readdirSync(LOCAL_COMPONENT_PATH, {
    recursive: true,
    withFileTypes: true,
  })
    .filter((f) => f.isFile())
    .map((f) =>
      join(f.parentPath, f.name).replace(LOCAL_COMPONENT_PATH + "/", "")
    );

  for (const assetFile of assetFileList) {
    renderedChunkMap.set(
      join(baseComponentPath, assetFile),
      readFileSync(join(LOCAL_COMPONENT_PATH, assetFile), "utf-8")
    );
  }

  // TODO: don't hard-code this for Docusaurus and make something more flexible
  // for different scaffolds
  renderedChunkMap.set(
    join(basePagePath, "tag", "_category_.json"),
    JSON.stringify(
      {
        position: 2,
        label: "Operations",
        collapsible: true,
        collapsed: false,
      },
      null,
      "  "
    )
  );

  return Object.fromEntries(renderedChunkMap);
}
