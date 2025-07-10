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
  docsCodeSnippets: DocsCodeSnippets;
};

// TODO: should make heading ID separator configurable, since different
// implementations seem to strip out different characters

export function renderOperation({
  renderer,
  site,
  chunk,
  docsData,
  docsCodeSnippets,
}: RenderOperationOptions) {
  const id = `operation-${snakeCase(chunk.chunkData.operationId)}`;
  renderer.appendHeading(
    2,
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
    renderer.appendSectionStart();
    renderer.appendSectionTitleStart();
    renderer.appendHeading(3, "Security", {
      id: securityId,
    });
    renderer.appendSectionTitleEnd();
    renderer.appendSectionContentStart();
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
          schemaStack: [],
          idPrefix: securityId,
        },
        topLevelName: "Security",
        data: docsData,
      });
    }
    renderer.appendSectionContentEnd();
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.parameters.length > 0) {
    const parametersId = id + "+parameters";
    renderer.appendSectionStart({ variant: "fields" });
    renderer.appendSectionTitleStart({ variant: "fields" });
    renderer.appendHeading(3, "Parameters", {
      id: parametersId,
    });
    renderer.appendSectionTitleEnd();
    for (const parameter of chunk.chunkData.parameters) {
      renderer.appendSectionContentStart({ variant: "fields" });
      renderer.appendHeading(
        4,
        `${parameter.name}${parameter.required ? " (required)" : ""}`,
        {
          id: `parametersId+${parameter.name}`,
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
          schemaStack: [],
          idPrefix: parametersId,
        },
        topLevelName: "Security",
        data: docsData,
      });
      renderer.appendSectionContentEnd();
    }
    renderer.appendSectionEnd();
  }

  const { tryItNow } = getSettings();
  const usageSnippet = docsCodeSnippets[chunk.id];
  if (usageSnippet && tryItNow) {
    renderer.appendSectionStart();
    renderer.appendSectionTitleStart();
    renderer.appendHeading(2, "Try it Now", {
      id: id + "+try-it-now",
    });
    renderer.appendSectionTitleEnd();
    renderer.appendSectionContentStart();
    // TODO: Zod is actually hard coded for now since its always a dependency
    // in our SDKs. Ideally this will come from the SDK package.
    renderer.appendTryItNow({
      externalDependencies: {
        zod: "^3.25.64",
        [tryItNow.npmPackageName]: "latest",
      },
      defaultValue: usageSnippet.code,
    });
    renderer.appendSectionContentEnd();
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.requestBody) {
    const requestBodyId = id + "+request";
    renderer.appendSectionStart();
    renderer.appendSectionTitleStart();
    renderer.appendHeading(
      2,
      `Request Body${!chunk.chunkData.requestBody.required ? " (optional)" : ""}`,
      { id: requestBodyId }
    );
    renderer.appendSectionTitleEnd();
    renderer.appendSectionContentStart();
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
        schemaStack: [],
        idPrefix: requestBodyId,
      },
      topLevelName: "Request Body",
      data: docsData,
    });
    renderer.appendSectionContentEnd();
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.responses) {
    const responseList = Object.entries(chunk.chunkData.responses);
    const hasResponses = responseList.some(
      ([_, responses]) => responses.length > 0
    );
    if (hasResponses) {
      renderer.appendTabbedSectionStart();
      const responsesId = id + "+responses";
      renderer.appendTabbedSectionTitleStart();
      renderer.appendHeading(2, "Responses", { id: responsesId });
      renderer.appendTabbedSectionTitleEnd();
      for (const [statusCode, responses] of responseList) {
        for (const response of responses) {
          const responseId =
            id + `+${statusCode}+${response.contentType.replace("/", "-")}`;
          const tooltip = `${statusCode} (${response.contentType})`;
          renderer.appendTabbedSectionTabStart(responseId, tooltip);
          if (responses.length > 1) {
            renderer.appendText(tooltip);
          } else {
            renderer.appendText(statusCode);
          }
          renderer.appendTabbedSectionTabEnd();
          renderer.appendTabbedSectionContentsStart(responseId);
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
              schemaStack: [],
              idPrefix: responseId,
            },
            topLevelName: "Response Body",
            data: docsData,
          });
          renderer.appendTabbedSectionContentsEnd();
        }
      }
      renderer.appendTabbedSectionEnd();
    }
  }
}
