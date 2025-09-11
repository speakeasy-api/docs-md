import type { OperationChunk } from "../../../types/chunk.ts";
import type { PropertyAnnotations } from "../../../types/shared.ts";
import { assertNever } from "../../../util/assertNever.ts";
import type { CodeSampleLanguage } from "../.././settings.ts";
import { getSettings } from "../.././settings.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import type { DocsCodeSnippets } from "../../data/generateCodeSnippets.ts";
import { debug } from "../../logging.ts";
import { getSchemaFromId, getSecurityFromId } from "../util.ts";
import {
  createDefaultValue,
  createExamples,
  getDisplayTypeInfo,
  renderBreakouts,
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
  renderer.createOperationSection(
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
        renderer.createSecuritySection(() => {
          const securityChunk = getSecurityFromId(
            contentChunkId,
            renderer.getDocsData()
          );
          for (const entry of securityChunk.chunkData.entries) {
            debug(`Rendering security chunk: name=${entry.name}`);
            renderer.enterContext({ id: entry.name, type: "schema" });
            renderer.createExpandableProperty({
              rawTitle: entry.name,
              isTopLevel: true,
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
              hasFrontMatter: !!entry.description || showDebugPlaceholders,
              createDescription:
                entry.description || showDebugPlaceholders
                  ? () => {
                      if (entry.description) {
                        renderer.createText(entry.description);
                      } else if (showDebugPlaceholders) {
                        renderer.createDebugPlaceholder(
                          () => "No description provided"
                        );
                      }
                    }
                  : undefined,
            });
            renderer.exitContext();
          }
        });
      }

      if (chunk.chunkData.parameters.length > 0) {
        renderer.createParametersSection(() => {
          for (const parameter of chunk.chunkData.parameters) {
            debug(`Rendering parameter: name=${parameter.name}`);
            renderer.enterContext({ id: parameter.name, type: "schema" });
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
            renderer.createExpandableProperty({
              typeInfo,
              annotations,
              rawTitle: parameter.name,
              isTopLevel: true,
              hasFrontMatter: !!parameter.description || showDebugPlaceholders,
              createDescription:
                parameter.description || showDebugPlaceholders
                  ? () => {
                      if (parameter.description) {
                        renderer.createText(parameter.description);
                      } else if (showDebugPlaceholders) {
                        renderer.createDebugPlaceholder(
                          () => "No description provided"
                        );
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

      const { tryItNow } = getSettings();
      const usageSnippet = docsCodeSnippets[chunk.id];
      if (usageSnippet && tryItNow) {
        renderer.createCodeSamplesSection(
          ({ createTryItNowEntry, createCodeSampleEntry }) => {
            for (const [language, snippet] of Object.entries(usageSnippet)) {
              debug(`Rendering code sample for ${language}`);
              if (language === "typescript") {
                createTryItNowEntry({
                  language,
                  externalDependencies: {
                    zod: "^3.25.64",
                    [snippet.packageName]: "latest",
                  },
                  defaultValue: snippet.code,
                });
              } else {
                createCodeSampleEntry({
                  // The Object.entries call above coerces the key to a string,
                  // even though the key is originally typed as CodeSampleLanguage
                  language: language as CodeSampleLanguage,
                  value: snippet.code,
                });
              }
            }
          }
        );
      }

      if (chunk.chunkData.requestBody) {
        debug(`Rendering request body`);
        const { requestBody } = chunk.chunkData;
        const requestBodySchema = getSchemaFromId(
          requestBody.contentChunkId,
          renderer.getDocsData()
        );
        const requestBodySchemaValue = requestBodySchema.chunkData.value;
        renderer.createRequestSection({
          isOptional: false,
          createDisplayType:
            requestBodySchemaValue.type !== "object"
              ? () => {
                  renderer.createFrontMatterDisplayType({
                    typeInfo: getDisplayTypeInfo(
                      requestBodySchema.chunkData.value,
                      renderer,
                      []
                    ),
                  });
                }
              : undefined,
          createDescription:
            requestBody.description ||
            ("description" in requestBodySchemaValue &&
              requestBodySchemaValue.description) ||
            showDebugPlaceholders
              ? () => {
                  // TODO: We can have a description at the requestBody level, or at
                  // the top-level schema. We prioritize the requestBody level
                  // description currently, but should we show both?
                  if (requestBody.description) {
                    renderer.createText(requestBody.description);
                  } else if (
                    "description" in requestBodySchemaValue &&
                    requestBodySchemaValue.description
                  ) {
                    renderer.createText(requestBodySchemaValue.description);
                  } else if (showDebugPlaceholders) {
                    renderer.createDebugPlaceholder(
                      () => "No description provided"
                    );
                  }
                }
              : undefined,
          createExamples: createExamples(requestBodySchemaValue, renderer),
          createDefaultValue: createDefaultValue(
            requestBodySchemaValue,
            renderer
          ),
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
          // This is a quick-n-dirty hack to check if we're displaying Server
          // Side Events or not. It's somewhat brittle since it doesn't support
          // endpoints that can return both SSEs and standard responses, but works
          // in the typical case where it only returns SSEs
          const isSSE = filteredResponseList.every(([statusCode, responses]) =>
            statusCode === "200"
              ? responses.every(
                  (response) => response.contentType === "text/event-stream"
                )
              : true
          );
          renderer.createResponsesSection(
            (createTab) => {
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
                    createDisplayType:
                      schema.type !== "object"
                        ? () => {
                            renderer.createFrontMatterDisplayType({
                              typeInfo: getDisplayTypeInfo(
                                schema,
                                renderer,
                                []
                              ),
                            });
                          }
                        : undefined,
                    createDescription:
                      response.description ||
                      ("description" in schema && schema.description) ||
                      showDebugPlaceholders
                        ? () => {
                            // TODO: We can have a description at the requestBody level, or at
                            // the top-level schema. We prioritize the requestBody level
                            // description currently, but should we show both?
                            if (response.description) {
                              renderer.createText(response.description);
                            } else if (
                              "description" in schema &&
                              schema.description
                            ) {
                              renderer.createText(schema.description);
                            } else if (showDebugPlaceholders) {
                              renderer.createDebugPlaceholder(
                                () => "No description provided"
                              );
                            }
                          }
                        : undefined,
                    createExamples: createExamples(schema, renderer),
                    createDefaultValue: createDefaultValue(schema, renderer),
                    createBreakouts() {
                      renderBreakouts({
                        renderer,
                        schema,
                      });
                    },
                  });
                }
              }
            },
            {
              title: isSSE ? "Server-Side Events" : "Responses",
            }
          );
        }
      }
    }
  );
}
