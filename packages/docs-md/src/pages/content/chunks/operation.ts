import { snakeCase } from "change-case";

import type { Renderer, Site } from "../../../renderers/base/base.ts";
import type { Chunk, OperationChunk } from "../../../types/chunk.ts";
import { getSettings } from "../../../util/settings.ts";
import type { DocsCodeSnippets } from "../../codeSnippets/generateCodeSnippets.ts";
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

// TODO: should make heading ID separator configurable, since different
// implementations seem to strip out different characters

export function renderOperation({
  renderer,
  site,
  chunk,
  docsData,
  baseHeadingLevel,
  docsCodeSnippets,
}: RenderOperationOptions) {
  const id = `operation-${snakeCase(chunk.chunkData.operationId)}`;
  renderer.appendHeading(
    baseHeadingLevel,
    `${chunk.chunkData.method.toUpperCase()} ${chunk.chunkData.path}`,
    { id }
  );

  if (chunk.chunkData.summary && chunk.chunkData.description) {
    renderer.appendText(`_${chunk.chunkData.summary}_`);
    renderer.appendText(chunk.chunkData.description);
  } else if (chunk.chunkData.summary) {
    renderer.appendText(chunk.chunkData.summary);
  } else if (chunk.chunkData.description) {
    renderer.appendText(chunk.chunkData.description);
  }

  if (chunk.chunkData.security || chunk.chunkData.globalSecurity) {
    const securityId = id + "+security";
    renderer.appendHeading(baseHeadingLevel + 1, "Security", {
      id: securityId,
    });
    if (chunk.chunkData.security) {
      const securityChunk = getSchemaFromId(
        chunk.chunkData.security.contentChunkId,
        docsData
      );
      renderSchema({
        context: {
          site,
          renderer,
          schema: securityChunk.chunkData.value,
          baseHeadingLevel: baseHeadingLevel + 2,
          schemaStack: [],
          idPrefix: securityId,
        },
        topLevelName: "Security",
        data: docsData,
      });
    }
    if (chunk.chunkData.globalSecurity) {
      const securityChunk = getSchemaFromId(
        chunk.chunkData.globalSecurity.contentChunkId,
        docsData
      );
      renderSchema({
        context: {
          site,
          renderer,
          schema: securityChunk.chunkData.value,
          baseHeadingLevel: baseHeadingLevel + 2,
          schemaStack: [],
          idPrefix: securityId,
        },
        topLevelName: "Security",
        data: docsData,
      });
    }
  }

  if (chunk.chunkData.parameters.length > 0) {
    const parametersId = id + "+parameters";
    renderer.appendHeading(baseHeadingLevel + 1, "Parameters", {
      id: parametersId,
    });
    for (const parameter of chunk.chunkData.parameters) {
      renderer.appendHeading(
        baseHeadingLevel + 2,
        `${parameter.name}${parameter.required ? " (required)" : ""}`,
        {
          id: parametersId + `+${parameter.name}`,
        }
      );
      if (parameter.description) {
        renderer.appendText(parameter.description);
      }
      const parameterChunk = getSchemaFromId(parameter.fieldChunkId, docsData);
      renderSchema({
        context: {
          site,
          renderer,
          schema: parameterChunk.chunkData.value,
          baseHeadingLevel: baseHeadingLevel + 2,
          schemaStack: [],
          idPrefix: parametersId,
        },
        topLevelName: "Security",
        data: docsData,
      });
    }
  }

  const { tryItNow } = getSettings();
  const usageSnippet = docsCodeSnippets[chunk.id];
  if (usageSnippet && tryItNow) {
    renderer.appendHeading(baseHeadingLevel + 1, "Try it Now", {
      id: id + "+try-it-now",
    });
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
    const requestBodyId = id + "+request";
    renderer.appendHeading(
      baseHeadingLevel + 1,
      `Request Body${chunk.chunkData.requestBody.required ? " (required)" : ""}`,
      { id: requestBodyId }
    );
    if (chunk.chunkData.requestBody.description) {
      renderer.appendText(chunk.chunkData.requestBody.description);
    }
    const requestBodySchema = getSchemaFromId(
      chunk.chunkData.requestBody.contentChunkId,
      docsData
    );
    renderSchema({
      context: {
        site,
        renderer,
        schema: requestBodySchema.chunkData.value,
        baseHeadingLevel: baseHeadingLevel + 2,
        schemaStack: [],
        idPrefix: requestBodyId,
      },
      topLevelName: "Request Body",
      data: docsData,
    });
  }

  if (chunk.chunkData.responses) {
    for (const [statusCode, responses] of Object.entries(
      chunk.chunkData.responses
    )) {
      for (const response of responses) {
        const responseId =
          id + `+${statusCode}+${response.contentType.replace("/", "-")}`;
        renderer.appendHeading(
          baseHeadingLevel + 1,
          `Response: ${statusCode} (${response.contentType})`,
          { id: responseId }
        );
        if (response.description) {
          renderer.appendText(response.description);
        }
        const responseSchema = getSchemaFromId(
          response.contentChunkId,
          docsData
        );
        renderSchema({
          context: {
            site,
            renderer,
            schema: responseSchema.chunkData.value,
            baseHeadingLevel: baseHeadingLevel + 2,
            schemaStack: [],
            idPrefix: responseId,
          },
          topLevelName: "Response Body",
          data: docsData,
        });
      }
    }
  }
}
