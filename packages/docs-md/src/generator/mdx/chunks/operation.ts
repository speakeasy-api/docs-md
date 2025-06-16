import type { Chunk, OperationChunk } from "../../../types/chunk.ts";
import type { DocsCodeSnippets } from "../../codeSnippets.ts";
import { getSettings } from "../../settings.ts";
import type { Renderer, Site } from "../renderer.ts";
import { getSchemaFromId } from "../util.ts";
import { renderSchema } from "./schema.ts";

type RenderOperationOptions = {
  renderer: Renderer;
  site: Site;
  chunk: OperationChunk;
  docsData: Map<string, Chunk>;
  baseHeadingLevel: number;
  docsCodeSnippets: DocsCodeSnippets;
};

export function renderOperation({
  renderer,
  site,
  chunk,
  docsData,
  baseHeadingLevel,
  docsCodeSnippets,
}: RenderOperationOptions) {
  renderer.appendHeading(
    baseHeadingLevel,
    `${chunk.chunkData.method.toUpperCase()} ${chunk.chunkData.path}`
  );

  if (chunk.chunkData.summary && chunk.chunkData.description) {
    renderer.appendParagraph(`_${chunk.chunkData.summary}_`);
    renderer.appendParagraph(chunk.chunkData.description);
  } else if (chunk.chunkData.summary) {
    renderer.appendParagraph(chunk.chunkData.summary);
  } else if (chunk.chunkData.description) {
    renderer.appendParagraph(chunk.chunkData.description);
  }

  if (chunk.chunkData.security || chunk.chunkData.globalSecurity) {
    renderer.appendHeading(baseHeadingLevel + 1, "Security");
    if (chunk.chunkData.security) {
      const securityChunk = getSchemaFromId(
        chunk.chunkData.security.contentChunkId,
        docsData
      );
      renderSchema({
        topLevelName: "Security",
        site,
        renderer,
        schema: securityChunk.chunkData.value,
        data: docsData,
        baseHeadingLevel: baseHeadingLevel + 2,
        depth: 0,
      });
    }
    if (chunk.chunkData.globalSecurity) {
      const securityChunk = getSchemaFromId(
        chunk.chunkData.globalSecurity.contentChunkId,
        docsData
      );
      renderSchema({
        topLevelName: "Security",
        site,
        renderer,
        schema: securityChunk.chunkData.value,
        data: docsData,
        baseHeadingLevel: baseHeadingLevel + 2,
        depth: 0,
      });
    }
  }

  if (chunk.chunkData.parameters.length > 0) {
    renderer.appendHeading(baseHeadingLevel + 1, "Parameters");
    for (const parameter of chunk.chunkData.parameters) {
      renderer.appendHeading(
        baseHeadingLevel + 2,
        `${parameter.name}${parameter.required ? " (required)" : ""}`
      );
      if (parameter.description) {
        renderer.appendParagraph(parameter.description);
      }
      const parameterChunk = getSchemaFromId(parameter.fieldChunkId, docsData);
      renderSchema({
        topLevelName: "Security",
        site,
        renderer,
        schema: parameterChunk.chunkData.value,
        data: docsData,
        baseHeadingLevel: baseHeadingLevel + 2,
        depth: 0,
      });
    }
  }

  const { tryItNow } = getSettings();

  const usageSnippet = docsCodeSnippets[chunk.id];
  if (usageSnippet && tryItNow) {
    renderer.appendHeading(baseHeadingLevel + 1, "Try it Now");
    // TODO: Zod is actually hard coded for now since its always a dependency
    // in our SDKs. Ideally this will come from the SDK package.
    renderer.appendTryItNow({
      externalDependencies: {
        zod: "^3.25.64",
        [tryItNow.npmPackageName]: "latest",
      },
      defaultValue: usageSnippet.code,
    });
  }

  if (chunk.chunkData.requestBody) {
    renderer.appendHeading(
      baseHeadingLevel + 1,
      `Request Body${chunk.chunkData.requestBody.required ? " (required)" : ""}`
    );
    if (chunk.chunkData.requestBody.description) {
      renderer.appendParagraph(chunk.chunkData.requestBody.description);
    }
    const requestBodySchema = getSchemaFromId(
      chunk.chunkData.requestBody.contentChunkId,
      docsData
    );
    renderSchema({
      topLevelName: "Request Body",
      site,
      renderer,
      schema: requestBodySchema.chunkData.value,
      data: docsData,
      baseHeadingLevel: baseHeadingLevel + 2,
      depth: 0,
    });
  }

  if (chunk.chunkData.responses) {
    for (const [statusCode, responses] of Object.entries(
      chunk.chunkData.responses
    )) {
      for (const response of responses) {
        renderer.appendHeading(
          baseHeadingLevel + 1,
          `Response: ${statusCode} (${response.contentType})`
        );
        if (response.description) {
          renderer.appendParagraph(response.description);
        }
        const responseSchema = getSchemaFromId(
          response.contentChunkId,
          docsData
        );
        renderSchema({
          topLevelName: "Response Body",
          site,
          renderer,
          schema: responseSchema.chunkData.value,
          data: docsData,
          baseHeadingLevel: baseHeadingLevel + 2,
          depth: 0,
        });
      }
    }
  }
}
