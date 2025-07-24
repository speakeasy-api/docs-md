import { snakeCase } from "change-case";

import type { Renderer, Site } from "../../../renderers/base/base.ts";
import type { Chunk, OperationChunk } from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { getSettings } from "../../../util/settings.ts";
import type { DocsCodeSnippets } from "../../codeSnippets/generateCodeSnippets.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";
import {
  getDisplayTypeInfo,
  renderSchemaDetails,
  renderSchemaFrontmatter,
} from "./schema.ts";

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
  renderer.addOperationSection(
    {
      method: chunk.chunkData.method,
      path: chunk.chunkData.path,
      operationId: chunk.chunkData.operationId,
      summary: chunk.chunkData.summary,
      description: chunk.chunkData.description,
    },
    (operationRenderer) => {
      // TODO: Remove explicit references to id and handle in renderers
      const id = `operation-${snakeCase(chunk.chunkData.operationId)}`;

      // TODO: Security is being rewritten anyways, so I'm not refactoring it as
      // part of the schema refactor
      if (chunk.chunkData.security) {
        operationRenderer.addSecuritySection((securityRenderer) => {
          // TODO: Security is being rewritten at the generator level, so I'm
          // not refactoring this code as part of the schema refactor
          securityRenderer.appendText("Coming Soon");
        });
      }

      if (chunk.chunkData.parameters.length > 0) {
        operationRenderer.addParametersSection((createParameter) => {
          for (const parameter of chunk.chunkData.parameters) {
            createParameter(
              { name: parameter.name, isRequired: parameter.required },
              ({ parameterRenderer }) => {
                const parameterChunk = getSchemaFromId(
                  parameter.fieldChunkId,
                  docsData
                );
                const parameterContext = {
                  site,
                  renderer: parameterRenderer,
                  schemaStack: [],
                  idPrefix: id,
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
              }
            );
          }
        });
      }

      // TODO: refactor to match other new high-level renderer methods
      const { tryItNow } = getSettings();
      const usageSnippet = docsCodeSnippets[chunk.id];
      if (usageSnippet && tryItNow) {
        operationRenderer.appendSectionStart({ variant: "top-level" });
        operationRenderer.appendSectionTitleStart({ variant: "top-level" });
        operationRenderer.appendHeading(
          HEADINGS.SECTION_HEADING_LEVEL,
          "Try it Now",
          {
            id: id + "+try-it-now",
          }
        );
        operationRenderer.appendSectionTitleEnd();
        operationRenderer.appendSectionContentStart({ variant: "top-level" });
        // TODO: Zod is actually hard coded for now since its always a dependency
        // in our SDKs. Ideally this will come from the SDK package.
        operationRenderer.appendTryItNow({
          externalDependencies: {
            zod: "^3.25.64",
            [tryItNow.npmPackageName]: "latest",
          },
          defaultValue: usageSnippet.code,
        });
        operationRenderer.appendSectionContentEnd();
        operationRenderer.appendSectionEnd();
      }

      if (chunk.chunkData.requestBody) {
        const { requestBody } = chunk.chunkData;
        operationRenderer.addRequestSection(
          { isOptional: false, site, data: docsData },
          (context) => {
            const requestBodySchema = getSchemaFromId(
              requestBody.contentChunkId,
              docsData
            );
            if (requestBodySchema.chunkData.value.type !== "object") {
              context.renderer.appendProperty({
                typeInfo: getDisplayTypeInfo(
                  requestBodySchema.chunkData.value,
                  context
                ),
                id: context.idPrefix,
                annotations: [],
                title: "",
              });
            }
            renderSchemaFrontmatter({
              context,
              schema: requestBodySchema.chunkData.value,
            });
            renderSchemaDetails({
              context,
              schema: requestBodySchema.chunkData.value,
            });
          }
        );
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
          operationRenderer.addResponsesSection((createTab) => {
            for (const [statusCode, responses] of filteredResponseList) {
              for (const response of responses) {
                createTab(
                  {
                    statusCode,
                    contentType: response.contentType,
                    site,
                    data: docsData,
                  },
                  (context) => {
                    const schema = getSchemaFromId(
                      response.contentChunkId,
                      docsData
                    ).chunkData.value;
                    if (schema.type !== "object") {
                      context.renderer.appendProperty({
                        typeInfo: getDisplayTypeInfo(schema, context),
                        id: context.idPrefix,
                        annotations: [],
                        title: "",
                      });
                    }
                    renderSchemaFrontmatter({
                      context,
                      schema,
                    });
                    renderSchemaDetails({
                      context,
                      schema,
                    });
                  }
                );
              }
            }
          });
        }
      }
    }
  );
}
