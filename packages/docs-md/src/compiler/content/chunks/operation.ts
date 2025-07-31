import { snakeCase } from "change-case";

import type { OperationChunk } from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { getSettings } from "../.././settings.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import type { DocsCodeSnippets } from "../../data/generateCodeSnippets.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId, getSecurityFromId } from "../util.ts";
import { renderBreakouts, renderSchemaFrontmatter } from "./schema.ts";

type RenderOperationOptions = {
  renderer: Renderer;
  chunk: OperationChunk;
  docsCodeSnippets: DocsCodeSnippets;
};

export function renderOperation({
  renderer,
  chunk,
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
    () => {
      if (chunk.chunkData.security) {
        const { contentChunkId } = chunk.chunkData.security;
        renderer.addSecuritySection(() => {
          const securityChunk = getSecurityFromId(
            contentChunkId,
            renderer.getDocsData()
          );
          for (const entry of securityChunk.chunkData.entries) {
            const hasFrontmatter = !!entry.description;
            renderer.enterContext(entry.name);
            renderer.addExpandableProperty({
              annotations: [
                {
                  title: entry.in,
                  variant: "info",
                },
                {
                  title: entry.type,
                  variant: "info",
                },
              ],
              title: entry.name,
              createContent: hasFrontmatter
                ? () => {
                    renderer.appendText(entry.description);
                  }
                : undefined,
            });
            renderer.exitContext();
          }
        });
      }

      if (chunk.chunkData.parameters.length > 0) {
        renderer.addParametersSection((createParameter) => {
          for (const parameter of chunk.chunkData.parameters) {
            createParameter(
              {
                name: parameter.name,
                isRequired: parameter.required,
              },
              () => {
                const parameterChunk = getSchemaFromId(
                  parameter.fieldChunkId,
                  renderer.getDocsData()
                );
                renderSchemaFrontmatter({
                  renderer,
                  schema: parameterChunk.chunkData.value,
                });
                renderBreakouts({
                  renderer,
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
        renderer.appendSectionStart({ variant: "top-level" });
        renderer.appendSectionTitleStart({ variant: "top-level" });
        renderer.appendHeading(HEADINGS.SECTION_HEADING_LEVEL, "Try it Now", {
          // TODO: Remove explicit references to id and handle in renderers
          id: `operation-${snakeCase(chunk.chunkData.operationId)}+try-it-now`,
        });
        renderer.appendSectionTitleEnd();
        renderer.appendSectionContentStart({ variant: "top-level" });
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
        const { requestBody } = chunk.chunkData;
        const requestBodySchema = getSchemaFromId(
          requestBody.contentChunkId,
          renderer.getDocsData()
        );
        renderer.addRequestSection({
          isOptional: false,
          createFrontMatter() {
            // TODO: readd
            // if (requestBodySchema.chunkData.value.type !== "object") {
            //   renderer.appendProperty({
            //     typeInfo: getDisplayTypeInfo(
            //       requestBodySchema.chunkData.value,
            //       renderer
            //     ),
            //     annotations: [],
            //     title: "",
            //   });
            // }
            // TODO: we can have two descriptions here. Need to figure
            // out something to do with them
            if (requestBody.description) {
              renderer.appendText(requestBody.description);
            }
            renderSchemaFrontmatter({
              renderer,
              schema: requestBodySchema.chunkData.value,
            });
          },
          createBreakouts() {
            renderBreakouts({
              renderer,
              schema: requestBodySchema.chunkData.value,
            });
          },
        });
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
          renderer.addResponsesSection((createTab) => {
            for (const [statusCode, responses] of filteredResponseList) {
              for (const response of responses) {
                const schema = getSchemaFromId(
                  response.contentChunkId,
                  renderer.getDocsData()
                ).chunkData.value;
                createTab({
                  statusCode,
                  contentType: response.contentType,
                  createFrontMatter() {
                    // TODO: readd
                    // if (schema.type !== "object") {
                    //   renderer.appendProperty({
                    //     typeInfo: getDisplayTypeInfo(schema, renderer),
                    //     annotations: [],
                    //     title: "",
                    //   });
                    // }
                    // TODO: we can have two descriptions here. Need to figure
                    // out something to do with them
                    if (response.description) {
                      renderer.appendText(response.description);
                    }
                    renderSchemaFrontmatter({
                      renderer,
                      schema,
                    });
                  },
                  createBreakouts() {
                    renderBreakouts({
                      renderer,
                      schema,
                    });
                  },
                });
              }
            }
          });
        }
      }
    }
  );
}
