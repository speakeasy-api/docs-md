import { snakeCase } from "change-case";

import type { OperationChunk } from "../../../types/chunk.ts";
import type { PropertyAnnotations } from "../../../types/shared.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { getSettings } from "../.././settings.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import type { DocsCodeSnippets } from "../../data/generateCodeSnippets.ts";
import { debug } from "../../logging.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId, getSecurityFromId } from "../util.ts";
import {
  getDisplayTypeInfo,
  renderBreakouts,
  renderSchemaFrontmatter,
} from "./schema.ts";

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
  debug(
    `Rendering operation chunk: method=${chunk.chunkData.method} path=${chunk.chunkData.path} operationId=${chunk.chunkData.operationId}`
  );
  const { showDebugPlaceholders } = getSettings().display;
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
            debug(`Rendering security chunk: name=${entry.name}`);
            const hasFrontmatter = !!entry.description || showDebugPlaceholders;
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
                    if (entry.description) {
                      renderer.appendText(entry.description);
                    }
                    if (showDebugPlaceholders) {
                      renderer.appendDebugPlaceholderStart();
                      renderer.appendText("No description provided");
                      renderer.appendDebugPlaceholderEnd();
                    }
                  }
                : undefined,
            });
            renderer.exitContext();
          }
        });
      }

      if (chunk.chunkData.parameters.length > 0) {
        renderer.addParametersSection(() => {
          for (const parameter of chunk.chunkData.parameters) {
            debug(`Rendering parameter: name=${parameter.name}`);
            renderer.enterContext(parameter.name);
            const annotations: PropertyAnnotations[] = [
              {
                title: parameter.in,
                variant: "info",
              },
            ];
            if (parameter.required) {
              annotations.push({ title: "required", variant: "warning" });
            }
            if (parameter.deprecated) {
              annotations.push({ title: "deprecated", variant: "warning" });
            }
            const parameterChunk = getSchemaFromId(
              parameter.fieldChunkId,
              renderer.getDocsData()
            );

            // Render front-matter. This logic is really similar to rendering
            // an object property in a schema, but with a few differences
            const typeInfo = getDisplayTypeInfo(
              parameterChunk.chunkData.value,
              renderer,
              []
            );
            const hasFrontmatter = !!parameter.description;
            renderer.addExpandableProperty({
              typeInfo,
              annotations,
              title: parameter.name,
              createContent: hasFrontmatter
                ? () => {
                    if (parameter.description) {
                      renderer.appendText(parameter.description);
                    }
                    if (showDebugPlaceholders) {
                      renderer.appendDebugPlaceholderStart();
                      renderer.appendText("No description provided");
                      renderer.appendDebugPlaceholderEnd();
                    }
                  }
                : undefined,
            });

            // Render breakouts, which will be separate expandable entries
            renderBreakouts({
              renderer,
              schema: parameterChunk.chunkData.value,
            });

            renderer.exitContext();
          }
        });
      }

      // TODO: refactor to match other new high-level renderer methods
      const { tryItNow } = getSettings();
      const usageSnippet = docsCodeSnippets[chunk.id];
      if (usageSnippet && tryItNow) {
        debug(`Rendering try it now`);
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
        debug(`Rendering request body`);
        const { requestBody } = chunk.chunkData;
        const requestBodySchema = getSchemaFromId(
          requestBody.contentChunkId,
          renderer.getDocsData()
        );
        renderer.addRequestSection({
          isOptional: false,
          createFrontMatter() {
            if (requestBodySchema.chunkData.value.type !== "object") {
              renderer.addFrontMatterDisplayType({
                typeInfo: getDisplayTypeInfo(
                  requestBodySchema.chunkData.value,
                  renderer,
                  []
                ),
              });
            }
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
                debug(
                  `Rendering response: statusCode=${statusCode}, contentType=${response.contentType}`
                );
                createTab({
                  statusCode,
                  contentType: response.contentType,
                  createFrontMatter() {
                    if (schema.type !== "object") {
                      renderer.addFrontMatterDisplayType({
                        typeInfo: getDisplayTypeInfo(schema, renderer, []),
                      });
                    }
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
