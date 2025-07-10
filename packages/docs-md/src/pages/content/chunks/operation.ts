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
    renderer.appendSectionStart("Security", {
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
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.parameters.length > 0) {
    const parametersId = id + "+parameters";
    renderer.appendSectionStart("Parameters", {
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
    renderer.appendSectionEnd();
  }

  const { tryItNow } = getSettings();
  const usageSnippet = docsCodeSnippets[chunk.id];
  if (usageSnippet && tryItNow) {
    renderer.appendSectionStart("Try it Now", {
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
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.requestBody) {
    const requestBodyId = id + "+request";
    renderer.appendSectionStart(
      `Request Body${!chunk.chunkData.requestBody.required ? " (optional)" : ""}`,
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
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.responses) {
    const responsesId = id + "+responses";
    renderer.appendTabbedSectionStart("Response", {
      id: responsesId,
    });
    for (const [statusCode, responses] of Object.entries(
      chunk.chunkData.responses
    )) {
      for (const response of responses) {
        const tooltip = `${statusCode} (${response.contentType})`;
        if (responses.length > 1) {
          renderer.appendTabContentsStart(tooltip, tooltip);
        } else {
          renderer.appendTabContentsStart(statusCode, tooltip);
        }
        const responseId =
          id + `+${statusCode}+${response.contentType.replace("/", "-")}`;
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
        renderer.appendTabContentsEnd();
      }
    }
    renderer.appendTabbedSectionEnd();
  }
}
