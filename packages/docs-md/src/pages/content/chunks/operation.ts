import { snakeCase } from "change-case";

import type { Renderer, Site } from "../../../renderers/base/base.ts";
import type { Chunk, OperationChunk } from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { getSettings } from "../../../util/settings.ts";
import type { DocsCodeSnippets } from "../../codeSnippets/generateCodeSnippets.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";
import { renderSchemaDetails, renderSchemaFrontmatter } from "./schema.ts";

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
  const { showDebugPlaceholders } = getSettings().display;
  const id = `operation-${snakeCase(chunk.chunkData.operationId)}`;
  const methodStart = renderer.createPillStart("primary");
  const methodEnd = renderer.createPillEnd();
  const path = renderer.escapeText(chunk.chunkData.path, {
    escape: "markdown",
  });
  renderer.appendHeading(
    HEADINGS.SECTION_TITLE_HEADING_LEVEL,
    `${methodStart}<b>${chunk.chunkData.method.toUpperCase()}</b>${methodEnd} ${path}`,
    { id, escape: "none" }
  );

  if (chunk.chunkData.summary && chunk.chunkData.description) {
    renderer.appendText(`_${chunk.chunkData.summary}_`);
    renderer.appendText(chunk.chunkData.description);
  } else if (chunk.chunkData.summary) {
    renderer.appendText(chunk.chunkData.summary);
    if (showDebugPlaceholders) {
      renderer.appendDebugPlaceholderStart();
      renderer.appendText("No description provided");
      renderer.appendDebugPlaceholderEnd();
    }
  } else if (chunk.chunkData.description) {
    renderer.appendText(chunk.chunkData.description);
    if (showDebugPlaceholders) {
      renderer.appendDebugPlaceholderStart();
      renderer.appendText("No summary provided");
      renderer.appendDebugPlaceholderEnd();
    }
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No summary provided");
    renderer.appendDebugPlaceholderEnd();
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No description provided");
    renderer.appendDebugPlaceholderEnd();
  }

  // TODO: Security is being rewritten anyways, so I'm not refactoring it as
  // part of the schema refactor
  if (chunk.chunkData.security) {
    const securityId = id + "+security";
    renderer.appendSectionStart();
    renderer.appendSectionTitleStart();
    renderer.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, "Security", {
      id: securityId,
    });
    renderer.appendSectionTitleEnd();
    renderer.appendSectionContentStart();
    // const securityChunk = getSchemaFromId(
    //   chunk.chunkData.security.contentChunkId,
    //   docsData
    // );
    // renderSchema({
    //   schema: securityChunk.chunkData.value,
    //   context: {
    //     site,
    //     renderer,
    //     schemaStack: [],
    //     idPrefix: securityId,
    //     data: docsData,
    //   },
    //   frontMatter: {
    //     description: "",
    //     examples: [],
    //     defaultValue: null,
    //   },
    //   topLevelName: "Security",
    // });
    renderer.appendSectionContentEnd();
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.parameters.length > 0) {
    const parametersId = id + "+parameters";
    renderer.appendSectionStart();
    renderer.appendSectionTitleStart();
    renderer.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, "Parameters", {
      id: parametersId,
    });
    renderer.appendSectionTitleEnd();
    for (const parameter of chunk.chunkData.parameters) {
      renderer.appendSectionContentStart();
      const start = renderer.createPillStart("warning");
      const end = renderer.createPillEnd();
      renderer.appendHeading(
        HEADINGS.PROPERTY_HEADING_LEVEL,
        `${renderer.escapeText(parameter.name, { escape: "markdown" })}${parameter.required ? ` ${start}required${end}` : ""}`,
        {
          id: `${parametersId}+${parameter.name}`,
          escape: "none",
        }
      );

      const parameterChunk = getSchemaFromId(parameter.fieldChunkId, docsData);
      const parameterContext = {
        site,
        renderer,
        schemaStack: [],
        idPrefix: parametersId,
        data: docsData,
      };
      renderSchemaFrontmatter({
        context: parameterContext,
        schema: parameterChunk.chunkData.value,
      });
      renderSchemaDetails({
        context: parameterContext,
        schema: parameterChunk.chunkData.value,
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
    renderer.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, "Try it Now", {
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
    const start = renderer.createPillStart("info");
    const end = renderer.createPillEnd();
    renderer.appendHeading(
      HEADINGS.SECTION_HEADING_LEVEL,
      `Request Body${!chunk.chunkData.requestBody.required ? ` ${start}optional${end}` : ""}`,
      { id: requestBodyId, escape: "none" }
    );
    renderer.appendSectionTitleEnd();
    renderer.appendSectionContentStart();

    const requestBodySchema = getSchemaFromId(
      chunk.chunkData.requestBody.contentChunkId,
      docsData
    );
    const context = {
      site,
      renderer,
      schemaStack: [],
      idPrefix: requestBodyId,
      data: docsData,
    };
    renderSchemaFrontmatter({
      context,
      schema: requestBodySchema.chunkData.value,
    });
    renderSchemaDetails({
      context,
      schema: requestBodySchema.chunkData.value,
    });

    renderer.appendSectionContentEnd();
    renderer.appendSectionEnd();
  }

  if (chunk.chunkData.responses) {
    const { visibleResponses } = getSettings().display;
    const responseList = Object.entries(chunk.chunkData.responses);
    const filteredResponseList = responseList.filter(([statusCode]) => {
      switch (visibleResponses) {
        case "all":
          return true;
        case "explicit":
          return !statusCode.endsWith("XX");
        case "success":
          return statusCode.startsWith("2");
        default:
          assertNever(visibleResponses);
      }
    });
    const numResponses = filteredResponseList.reduce(
      (acc, [_, responses]) => acc + responses.length,
      0
    );
    if (numResponses > 0) {
      renderer.appendTabbedSectionStart();
      const responsesId = id + "+responses";
      renderer.appendSectionTitleStart({
        borderVariant: "none",
        paddingVariant: "none",
      });
      renderer.appendHeading(
        HEADINGS.SECTION_HEADING_LEVEL,
        numResponses === 1 ? "Response" : "Responses",
        {
          id: responsesId,
        }
      );
      renderer.appendSectionTitleEnd();
      for (const [statusCode, responses] of filteredResponseList) {
        for (const response of responses) {
          const responseId =
            id + `+${statusCode}+${response.contentType.replace("/", "-")}`;
          const tooltip = `${statusCode} (${response.contentType})`;
          renderer.appendTabbedSectionTabStart(responseId);
          if (responses.length > 1) {
            renderer.appendText(tooltip);
          } else {
            renderer.appendText(statusCode);
          }
          renderer.appendTabbedSectionTabEnd();
          renderer.appendSectionContentStart({ id: responseId });

          const responseSchema = getSchemaFromId(
            response.contentChunkId,
            docsData
          );
          const context = {
            site,
            renderer,
            schemaStack: [],
            idPrefix: responseId,
            data: docsData,
          };
          renderSchemaFrontmatter({
            context,
            schema: responseSchema.chunkData.value,
          });
          renderSchemaDetails({
            context,
            schema: responseSchema.chunkData.value,
          });

          renderer.appendSectionContentEnd();
        }
      }
      renderer.appendTabbedSectionEnd();
    }
  }
}
