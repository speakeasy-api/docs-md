import type {
  OperationChunk,
  SchemaValue,
  TagChunk,
} from "@speakeasy-api/docs-md-shared/types";
import type { PropertyAnnotations } from "@speakeasy-api/docs-md-shared/types";

import type { DocsCodeSnippets } from "../../data/generateCodeSnippets.ts";
import { debug } from "../../logging.ts";
import type { Renderer } from "../../renderers/base.ts";
import type { CodeSampleLanguage } from "../../settings.ts";
import { getSettings } from "../../settings.ts";
import { assertNever } from "../../util/assertNever.ts";
import { getSchemaFromId, getSecurityFromId } from "../util.ts";
import {
  getDisplayTypeInfo,
  renderBreakoutEntries,
  renderObjectProperties,
} from "./schema.ts";

type RenderOperationOptions = {
  renderer: Renderer;
  chunk: OperationChunk;
  tagChunk: TagChunk;
  docsCodeSnippets: DocsCodeSnippets;
};

function createTopLevelExamples(
  examples: { name: string; value: string }[],
  renderer: Renderer
) {
  const { showDebugPlaceholders } = getSettings().display;
  if (examples.length > 0) {
    return () => {
      renderer.createText(`_${examples.length > 1 ? "Examples" : "Example"}:_`);
      for (const example of examples) {
        renderer.createCode(
          // Unfortunately, the output of Go's YAML to JSON
          // conversion doesn't give us options to control the
          // indentation of the output, so we have to do it
          // ourselves
          JSON.stringify(JSON.parse(example.value), null, "  ")
        );
      }
    };
  } else if (showDebugPlaceholders) {
    return () =>
      renderer.createDebugPlaceholder({
        createTitle() {
          renderer.createText("No examples provided");
        },
        createExample() {
          renderer.createCode(
            "requestBody:\n  content:\n    application/json:\n      examples:\n        example1:\n          value: {}",
            {
              variant: "default",
              style: "block",
            }
          );
        },
      });
  }
  return undefined;
}

function renderCodeSamples(
  renderer: Renderer,
  docsCodeSnippets: DocsCodeSnippets,
  operationChunkId: string
) {
  const { codeSamples } = getSettings();
  const usageSnippet = docsCodeSnippets[operationChunkId];
  if (usageSnippet && codeSamples) {
    renderer.createCodeSamplesSection(
      ({ createTryItNowEntry, createCodeSampleEntry }) => {
        for (const [language, snippet] of Object.entries(usageSnippet)) {
          debug(`Rendering code sample for ${language}`);
          if (
            language === "typescript" &&
            codeSamples.some(
              (s) => s.language === "typescript" && s.enableTryItNow
            )
          ) {
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
}

function renderBreakouts({
  renderer,
  schema,
}: {
  renderer: Renderer;
  schema: SchemaValue;
}) {
  const typeInfo = getDisplayTypeInfo(schema, renderer, []);

  // Check if this is an object, and if so render its properties
  if (schema.type === "object") {
    renderObjectProperties({
      renderer,
      schema,
    });
    return;
  }
  // Otherwise check if we have any breakouts to render
  else if (typeInfo && typeInfo.breakoutSubTypes.size > 0) {
    renderBreakoutEntries({
      renderer,
      typeInfo,
    });
    return;
  }
}

export function renderSecurity(
  security: OperationChunk["chunkData"]["security"],
  renderer: Renderer
) {
  if (!security) {
    return;
  }
  const { contentChunkId } = security;
  const { showDebugPlaceholders } = getSettings().display;
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
        hasExpandableContent: !!entry.description || showDebugPlaceholders,
        createDescription:
          entry.description || showDebugPlaceholders
            ? () => {
                if (entry.description) {
                  renderer.createText(entry.description);
                } else if (showDebugPlaceholders) {
                  renderer.createDebugPlaceholder({
                    createTitle() {
                      renderer.createText("No description provided");
                    },
                    createExample() {
                      renderer.createCode(
                        "securitySchemes:\n  APIKey:\n    description: My API key description",
                        {
                          variant: "default",
                          style: "block",
                        }
                      );
                    },
                  });
                }
              }
            : undefined,
      });
      renderer.exitContext();
    }
  });
}

export function renderParameters(
  parameters: OperationChunk["chunkData"]["parameters"],
  renderer: Renderer
) {
  if (parameters.length === 0) {
    return;
  }
  debug(`Rendering parameters`);
  const { showDebugPlaceholders } = getSettings().display;
  renderer.createParametersSection(() => {
    for (const parameter of parameters) {
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
      if (!typeInfo) {
        continue;
      }
      renderer.createExpandableProperty({
        typeInfo,
        annotations,
        rawTitle: parameter.name,
        isTopLevel: true,
        hasExpandableContent: !!parameter.description || showDebugPlaceholders,
        createDescription:
          parameter.description || showDebugPlaceholders
            ? () => {
                if (parameter.description) {
                  renderer.createText(parameter.description);
                } else if (showDebugPlaceholders) {
                  renderer.createDebugPlaceholder({
                    createTitle() {
                      renderer.createText("No description provided");
                    },
                    createExample() {
                      renderer.createCode(
                        "description: My awesome description",
                        {
                          variant: "default",
                          style: "block",
                        }
                      );
                    },
                  });
                }
              }
            : undefined,
        createBreakouts() {
          renderBreakouts({
            renderer,
            schema: parameterChunk.chunkData.value,
          });
        },
      });

      renderer.exitContext();
    }
  });
}

export function renderRequestBody(
  requestBody: OperationChunk["chunkData"]["requestBody"],
  renderer: Renderer
) {
  if (!requestBody) {
    return;
  }
  debug(`Rendering request body`);
  const { showDebugPlaceholders } = getSettings().display;
  const requestBodySchema = getSchemaFromId(
    requestBody.contentChunkId,
    renderer.getDocsData()
  );
  const requestBodySchemaValue = requestBodySchema.chunkData.value;
  const typeInfo = getDisplayTypeInfo(
    requestBodySchema.chunkData.value,
    renderer,
    []
  );
  renderer.createRequestSection({
    isOptional: false,
    createDisplayType:
      requestBodySchemaValue.type !== "object" && typeInfo
        ? () => {
            renderer.createFrontMatterDisplayType({
              typeInfo,
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
              renderer.createDebugPlaceholder({
                createTitle() {
                  renderer.createText("No description provided");
                },
                createExample() {
                  renderer.createCode("description: My awesome description", {
                    variant: "default",
                    style: "block",
                  });
                },
              });
            }
          }
        : undefined,
    createExamples: createTopLevelExamples(requestBody.examples, renderer),
    createBreakouts() {
      renderBreakouts({
        renderer,
        schema: requestBodySchema.chunkData.value,
      });
    },
  });
}

export function renderResponseBodies(
  responses: OperationChunk["chunkData"]["responses"],
  renderer: Renderer
) {
  const { showDebugPlaceholders } = getSettings().display;
  const { visibleResponses } = getSettings().display;
  const responseList = Object.entries(responses);
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
            const typeInfo = getDisplayTypeInfo(schema, renderer, []);
            debug(
              `Rendering response: statusCode=${statusCode}, contentType=${response.contentType}`
            );
            createTab({
              statusCode,
              contentType: response.contentType,
              showContentTypeInTab: responses.length > 1,
              createDisplayType:
                schema.type !== "object" && typeInfo
                  ? () => {
                      renderer.createFrontMatterDisplayType({
                        typeInfo,
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
                        renderer.createDebugPlaceholder({
                          createTitle() {
                            renderer.createText("No description provided");
                          },
                          createExample() {
                            renderer.createCode(
                              "description: My awesome description",
                              {
                                variant: "default",
                                style: "block",
                              }
                            );
                          },
                        });
                      }
                    }
                  : undefined,
              createExamples: createTopLevelExamples(
                response.examples,
                renderer
              ),
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

export function renderOperation({
  renderer,
  tagChunk,
  chunk,
  docsCodeSnippets,
}: RenderOperationOptions) {
  debug(
    `Rendering operation chunk: method=${chunk.chunkData.method} path=${chunk.chunkData.path} operationId=${chunk.chunkData.operationId}`
  );
  renderer.createOperationSection(
    {
      tag: tagChunk,
      method: chunk.chunkData.method,
      path: chunk.chunkData.path,
      operationId: chunk.chunkData.operationId,
      summary: chunk.chunkData.summary,
      description: chunk.chunkData.description,
    },
    () => {
      renderCodeSamples(renderer, docsCodeSnippets, chunk.id);
      renderSecurity(chunk.chunkData.security, renderer);
      renderParameters(chunk.chunkData.parameters, renderer);
      renderRequestBody(chunk.chunkData.requestBody, renderer);
      renderResponseBodies(chunk.chunkData.responses, renderer);
    }
  );
}
