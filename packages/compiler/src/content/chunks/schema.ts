import type {
  ObjectValue,
  SchemaValue,
} from "@speakeasy-api/docs-md-shared/types";
import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "@speakeasy-api/docs-md-shared/types";

import type { Renderer } from "../../renderers/base.ts";
import { getSettings } from "../../settings.ts";
import { assertNever } from "../../util/assertNever.ts";
import { InternalError } from "../../util/internalError.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";

/* ---- Helpers ---- */

function getDisplayTypeLabel(schema: SchemaValue) {
  switch (schema.type) {
    case "object": {
      return schema.name;
    }
    case "array": {
      return "array";
    }
    case "map": {
      return "map";
    }
    case "set": {
      return "set";
    }
    case "union": {
      return "union";
    }
    case "chunk": {
      return schema.chunkId;
    }
    case "enum": {
      return "enum";
    }
    case "jsonl": {
      return "jsonl";
    }
    case "event-stream": {
      return "event-stream";
    }
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "date":
    case "date-time":
    case "integer":
    case "int32":
    case "float32":
    case "decimal":
    case "binary":
    case "null":
    case "any": {
      return schema.type;
    }
    default: {
      assertNever(schema);
    }
  }
}

export function getDisplayTypeInfo(
  schema: SchemaValue,
  renderer: Renderer,
  chunkIdStack: string[]
): DisplayTypeInfo {
  switch (schema.type) {
    case "object": {
      return {
        label: getDisplayTypeLabel(schema),
        linkedLabel: `<a href="#${renderer.getCurrentId(schema.name)}">${schema.name}</a>`,
        children: [],
        breakoutSubTypes: new Map([[schema.name, schema]]),
      };
    }
    case "array": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer, chunkIdStack);
      return {
        ...typeInfo,
        label: getDisplayTypeLabel(schema),
        children: [typeInfo],
      };
    }
    case "map": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer, chunkIdStack);
      return {
        ...typeInfo,
        label: getDisplayTypeLabel(schema),
        children: [typeInfo],
      };
    }
    case "set": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer, chunkIdStack);
      return {
        ...typeInfo,
        label: getDisplayTypeLabel(schema),
        children: [typeInfo],
      };
    }
    case "jsonl": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer, chunkIdStack);
      return {
        ...typeInfo,
        label: getDisplayTypeLabel(schema),
        children: [typeInfo],
      };
    }
    case "event-stream": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer, chunkIdStack);
      return {
        ...typeInfo,
        label: getDisplayTypeLabel(schema),
        children: [typeInfo],
      };
    }
    case "union": {
      const displayTypes = schema.values.map((v) =>
        getDisplayTypeInfo(v, renderer, chunkIdStack)
      );
      const hasBreakoutSubType = displayTypes.some(
        (d) => d.breakoutSubTypes.size > 0
      );
      if (!hasBreakoutSubType) {
        return {
          label: getDisplayTypeLabel(schema),
          linkedLabel: getDisplayTypeLabel(schema),
          children: displayTypes,
          breakoutSubTypes: new Map(),
        };
      }
      const breakoutSubTypes = new Map<string, SchemaValue>();
      for (const displayType of displayTypes) {
        for (const [key, value] of displayType.breakoutSubTypes) {
          breakoutSubTypes.set(key, value);
        }
      }
      return {
        label: getDisplayTypeLabel(schema),
        linkedLabel: getDisplayTypeLabel(schema),
        children: displayTypes,
        breakoutSubTypes,
      };
    }
    case "chunk": {
      const schemaChunk = getSchemaFromId(
        schema.chunkId,
        renderer.getDocsData()
      ).chunkData.value;
      if (chunkIdStack.includes(schema.chunkId)) {
        // Return childless type info to prevent infinite recursion
        return {
          // TODO: come up with better visual treatment for recursive types
          label: `${getDisplayTypeLabel(schemaChunk)} (recursive)`,
          linkedLabel: `${getDisplayTypeLabel(schemaChunk)} (recursive)`,
          children: [],
          breakoutSubTypes: new Map(),
        };
      }
      return getDisplayTypeInfo(schemaChunk, renderer, [
        ...chunkIdStack,
        schema.chunkId,
      ]);
    }
    case "enum": {
      return {
        label: getDisplayTypeLabel(schema),
        linkedLabel: getDisplayTypeLabel(schema),
        children: schema.values.map((v) => {
          const label = `${typeof v === "string" ? `"${v}"` : v}`;
          return {
            label,
            linkedLabel: label,
            children: [],
            breakoutSubTypes: new Map(),
          };
        }),
        breakoutSubTypes: new Map(),
      };
    }
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "date":
    case "date-time":
    case "integer":
    case "int32":
    case "float32":
    case "decimal":
    case "binary":
    case "null":
    case "any": {
      return {
        label: schema.type,
        linkedLabel: schema.type,
        children: [],
        breakoutSubTypes: new Map(),
      };
    }
    default: {
      assertNever(schema);
    }
  }
}

function hasSchemaFrontmatter(schema: SchemaValue) {
  const description = "description" in schema ? schema.description : null;
  const examples = "examples" in schema ? schema.examples : [];
  const defaultValue = "defaultValue" in schema ? schema.defaultValue : null;
  const { showDebugPlaceholders } = getSettings().display;
  return (
    !!description ||
    examples.length > 0 ||
    !!defaultValue ||
    showDebugPlaceholders
  );
}

function shouldRenderInEmbed(renderer: Renderer) {
  const { maxNestingLevel } = getSettings().display;
  if (
    maxNestingLevel !== undefined &&
    renderer.getSchemaDepth() > maxNestingLevel
  ) {
    return true;
  }
  return false;
}

/* ---- Front matter rendering */

function createDescription(schema: SchemaValue, renderer: Renderer) {
  const { showDebugPlaceholders } = getSettings().display;
  const description = "description" in schema ? schema.description : null;
  if (description) {
    return () => renderer.createText(description);
  } else if (showDebugPlaceholders) {
    return () =>
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
  return undefined;
}

function createExamples(schema: SchemaValue, renderer: Renderer) {
  const examples = "examples" in schema ? schema.examples : [];
  const { showDebugPlaceholders } = getSettings().display;
  if (examples.length > 0) {
    return () => {
      renderer.createText(`_${examples.length > 1 ? "Examples" : "Example"}:_`);
      for (const example of examples) {
        renderer.createCode(example);
      }
    };
  } else if (showDebugPlaceholders) {
    return () =>
      renderer.createDebugPlaceholder({
        createTitle() {
          renderer.createText("No examples provided");
        },
        createExample() {
          renderer.createCode("examples:\n  - MyExampleValue", {
            variant: "default",
            style: "block",
          });
        },
      });
  }
  return undefined;
}

function createDefaultValue(schema: SchemaValue, renderer: Renderer) {
  const defaultValue = "defaultValue" in schema ? schema.defaultValue : null;
  const { showDebugPlaceholders } = getSettings().display;
  if (defaultValue) {
    return () => renderer.createText(`_Default Value:_ \`${defaultValue}\``);
  } else if (showDebugPlaceholders) {
    return () =>
      renderer.createDebugPlaceholder({
        createTitle() {
          renderer.createText("No default value provided");
        },
        createExample() {
          renderer.createCode("defaultValue: MyDefaultValue", {
            variant: "default",
            style: "block",
          });
        },
      });
  }
  return undefined;
}

/* ---- Section Rendering ---- */

function createExpandableProperty({
  renderer,
  property,
  typeInfo,
  isTopLevel,
  createEmbed,
}: {
  renderer: Renderer;
  property: {
    name: string;
    isRequired: boolean;
    isDeprecated: boolean;
    schema: SchemaValue;
  };
  typeInfo: DisplayTypeInfo;
  isTopLevel: boolean;
  createEmbed?: () => void;
}) {
  const annotations: PropertyAnnotations[] = [];
  if (property.isRequired) {
    annotations.push({ title: "required", variant: "warning" });
  }
  if (property.isDeprecated) {
    annotations.push({ title: "deprecated", variant: "warning" });
  }
  switch (property.schema.type) {
    case "array": {
      if (property.schema.minItems !== null) {
        annotations.push({
          title: `Min Items: ${property.schema.minItems}`,
          variant: "warning",
        });
      }
      if (property.schema.maxItems !== null) {
        annotations.push({
          title: `Max Items: ${property.schema.maxItems}`,
          variant: "warning",
        });
      }
      break;
    }
    case "integer":
    case "number":
    case "int32":
    case "float32":
    case "decimal":
    case "bigint": {
      if (property.schema.minimum !== null) {
        annotations.push({
          title: `Min: ${property.schema.minimum}`,
          variant: "warning",
        });
      }
      if (property.schema.maximum !== null) {
        annotations.push({
          title: `Max: ${property.schema.maximum}`,
          variant: "warning",
        });
      }
      break;
    }
    case "string": {
      if (property.schema.minLength !== null) {
        annotations.push({
          title: `Min Length: ${property.schema.minLength}`,
          variant: "warning",
        });
      }
      if (property.schema.maxLength !== null) {
        annotations.push({
          title: `Max Length: ${property.schema.maxLength}`,
          variant: "warning",
        });
      }
      if (property.schema.pattern !== null) {
        annotations.push({
          title: `Pattern: ${property.schema.pattern}`,
          variant: "warning",
        });
      }
      break;
    }
  }
  renderer.createExpandableProperty({
    typeInfo,
    annotations,
    rawTitle: property.name,
    isTopLevel,
    hasFrontMatter: !!createEmbed || hasSchemaFrontmatter(property.schema),
    createDescription: createDescription(property.schema, renderer),
    createExamples: createExamples(property.schema, renderer),
    createDefaultValue: createDefaultValue(property.schema, renderer),
    createEmbed,
  });
}

function renderObjectProperties({
  renderer,
  schema,
}: {
  renderer: Renderer;
  schema: ObjectValue;
}) {
  const isTopLevel = renderer.getCurrentContextType() !== "schema";
  const properties = Object.entries(schema.properties).map(
    ([name, propertySchema]) => {
      if (propertySchema.type === "chunk") {
        propertySchema = getSchemaFromId(
          propertySchema.chunkId,
          renderer.getDocsData()
        ).chunkData.value;
      }
      return {
        name,
        isRequired: schema.required.includes(name),
        // TODO: we need support for this in the generator
        isDeprecated: false,
        schema: propertySchema,
      };
    }
  );
  for (const property of properties) {
    if (renderer.alreadyInContext(property.name)) {
      // TODO: handle this recursive case better
      continue;
    }

    renderer.enterContext({ id: property.name, type: "schema" });

    // Check if we're too deeply nested to render this inline, but have more
    // breakouts to render at a deeper level
    const typeInfo = getDisplayTypeInfo(property.schema, renderer, []);
    const hasEmbed =
      shouldRenderInEmbed(renderer) && typeInfo.breakoutSubTypes.size > 0;

    // Render the expandable entry in the main document
    createExpandableProperty({
      renderer,
      property,
      typeInfo,
      isTopLevel,
      createEmbed: !hasEmbed
        ? undefined
        : () => {
            renderer.createEmbed({
              slug: property.name,
              embedTitle: property.name,
              triggerText: `View ${property.name} details`,
              createdEmbeddedContent(embedRenderer) {
                // Re-render the breakout in the embed document
                createExpandableProperty({
                  renderer: embedRenderer,
                  property,
                  typeInfo,
                  isTopLevel: true,
                });

                // Render breakouts, which will be separate expandable entries
                renderBreakouts({
                  renderer: embedRenderer,
                  schema: property.schema,
                });
              },
            });
          },
    });

    // If we aren't embedding, render its entries in the main document
    if (!hasEmbed) {
      renderBreakouts({
        renderer,
        schema: property.schema,
      });
    }

    renderer.exitContext();
  }
}

function createExpandableBreakout({
  renderer,
  breakout,
  isTopLevel,
  createEmbed,
}: {
  renderer: Renderer;
  breakout: {
    label: string;
    schema: ObjectValue;
  };
  isTopLevel: boolean;
  createEmbed?: () => void;
}) {
  const { showDebugPlaceholders } = getSettings().display;
  renderer.createExpandableBreakout({
    rawTitle: breakout.label,
    isTopLevel,
    createTitle: () => {
      renderer.createHeading(
        HEADINGS.SUB_SECTION_HEADING_LEVEL,
        breakout.label,
        {
          id: renderer.getCurrentId(),
        }
      );
    },
    hasFrontMatter: !!createEmbed || hasSchemaFrontmatter(breakout.schema),
    createDescription() {
      const description =
        "description" in breakout.schema ? breakout.schema.description : null;
      if (description) {
        renderer.createText(description);
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
    },
    createExamples() {
      const examples =
        "examples" in breakout.schema ? breakout.schema.examples : [];
      if (examples.length > 0) {
        renderer.createText(
          `_${examples.length > 1 ? "Examples" : "Example"}:_`
        );
        for (const example of examples) {
          renderer.createCode(example);
        }
      } else if (showDebugPlaceholders) {
        renderer.createDebugPlaceholder({
          createTitle() {
            renderer.createText("No examples provided");
          },
          createExample() {
            renderer.createCode("examples:\n  - MyExampleValue", {
              variant: "default",
              style: "block",
            });
          },
        });
      }
    },
    createDefaultValue() {
      const defaultValue =
        "defaultValue" in breakout.schema ? breakout.schema.defaultValue : null;
      if (defaultValue) {
        renderer.createText(`_Default Value:_ \`${defaultValue}\``);
      } else if (showDebugPlaceholders) {
        renderer.createDebugPlaceholder({
          createTitle() {
            renderer.createText("No default value provided");
          },
          createExample() {
            renderer.createCode("defaultValue: MyDefaultValue", {
              variant: "default",
              style: "block",
            });
          },
        });
      }
    },
    createEmbed,
  });
}

function renderBreakoutEntries({
  renderer,
  typeInfo,
}: {
  renderer: Renderer;
  typeInfo: DisplayTypeInfo;
}) {
  const isTopLevel = renderer.getCurrentContextType() !== "schema";
  const entries = Array.from(typeInfo.breakoutSubTypes.entries()).map(
    ([label, schema]) => {
      // Shouldn't be possible due to how type info is computed
      if (schema.type !== "object") {
        throw new InternalError("Breakout subtypes must be objects");
      }
      return {
        label,
        schema,
      };
    }
  );

  for (const breakout of entries) {
    if (renderer.alreadyInContext(breakout.label)) {
      // TODO: handle this recursive case better
      continue;
    }

    renderer.enterContext({ id: breakout.label, type: "schema" });

    // Check if we're too deeply nested to render this inline, but have more
    // properties to render at a deeper level
    const hasEmbed =
      shouldRenderInEmbed(renderer) &&
      Object.keys(breakout.schema.properties).length > 0;

    // Render the breakout entry in the main document
    createExpandableBreakout({
      renderer,
      breakout,
      isTopLevel,
      createEmbed: !hasEmbed
        ? undefined
        : () => {
            renderer.createEmbed({
              slug: breakout.label,
              embedTitle: breakout.label,
              triggerText: `View ${breakout.label} details`,
              createdEmbeddedContent(embedRenderer) {
                // Re-render the breakout in the embed document
                createExpandableBreakout({
                  renderer: embedRenderer,
                  breakout,
                  isTopLevel: true,
                });

                // Render the breakout properties in the embed document
                renderObjectProperties({
                  renderer: embedRenderer,
                  schema: breakout.schema,
                });
              },
            });
          },
    });

    // If we aren't embedding, render its entries in the main document
    if (!hasEmbed) {
      renderObjectProperties({
        renderer,
        schema: breakout.schema,
      });
    }

    renderer.exitContext();
  }
}

/* ---- Root ---- */

export function renderBreakouts({
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
  else if (typeInfo.breakoutSubTypes.size > 0) {
    renderBreakoutEntries({
      renderer,
      typeInfo,
    });
    return;
  }
}
