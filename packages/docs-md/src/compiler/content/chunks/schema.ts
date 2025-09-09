import type { ObjectValue, SchemaValue } from "../../../types/chunk.ts";
import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "../../../types/shared.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { InternalError } from "../../../util/internalError.ts";
import type { Renderer } from "../..//renderers/base/base.ts";
import { getSettings } from "../../settings.ts";
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

/* ---- Front matter rendering */

function createDescription(schema: SchemaValue, renderer: Renderer) {
  const { showDebugPlaceholders } = getSettings().display;
  const description = "description" in schema ? schema.description : null;
  if (description) {
    return () => renderer.createText(description);
  } else if (showDebugPlaceholders) {
    return () =>
      renderer.createDebugPlaceholder(() => "No description provided");
  }
  return undefined;
}

export function createExamples(schema: SchemaValue, renderer: Renderer) {
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
    return () => renderer.createDebugPlaceholder(() => "No examples provided");
  }
  return undefined;
}

export function createDefaultValue(schema: SchemaValue, renderer: Renderer) {
  const defaultValue = "defaultValue" in schema ? schema.defaultValue : null;
  const { showDebugPlaceholders } = getSettings().display;
  if (defaultValue) {
    return () => renderer.createText(`_Default Value:_ \`${defaultValue}\``);
  } else if (showDebugPlaceholders) {
    return () =>
      renderer.createDebugPlaceholder(() => "No default value provided");
  }
  return undefined;
}

/* ---- Section Rendering ---- */

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
      // TODO: handle this better
      continue;
    }
    renderer.enterContext({ id: property.name, type: "schema" });

    // Render the expandable entry
    const typeInfo = getDisplayTypeInfo(property.schema, renderer, []);
    const annotations: PropertyAnnotations[] = [];
    if (property.isRequired) {
      annotations.push({ title: "required", variant: "warning" });
    }
    if (property.isDeprecated) {
      annotations.push({ title: "deprecated", variant: "warning" });
    }
    renderer.createExpandableProperty({
      typeInfo,
      annotations,
      rawTitle: property.name,
      isTopLevel,
      hasFrontMatter: hasSchemaFrontmatter(property.schema),
      createDescription: createDescription(property.schema, renderer),
      createExamples: createExamples(property.schema, renderer),
      createDefaultValue: createDefaultValue(property.schema, renderer),
    });

    // Render breakouts, which will be separate expandable entries
    renderBreakouts({
      renderer,
      schema: property.schema,
    });

    renderer.exitContext();
  }
}

function renderContainerTypes({
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
      // TODO: handle this better
      continue;
    }
    renderer.enterContext({ id: breakout.label, type: "schema" });

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
      hasFrontMatter: hasSchemaFrontmatter(breakout.schema),
      createDescription() {
        const description =
          "description" in breakout.schema ? breakout.schema.description : null;
        if (description) {
          renderer.createText(description);
        } else if (showDebugPlaceholders) {
          renderer.createDebugPlaceholder(() => "No description provided");
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
          renderer.createDebugPlaceholder(() => "No examples provided");
        }
      },
      createDefaultValue() {
        const defaultValue =
          "defaultValue" in breakout.schema
            ? breakout.schema.defaultValue
            : null;
        if (defaultValue) {
          renderer.createText(`_Default Value:_ \`${defaultValue}\``);
        } else if (showDebugPlaceholders) {
          renderer.createDebugPlaceholder(() => "No default value provided");
        }
      },
    });

    renderObjectProperties({
      renderer,
      schema: breakout.schema,
    });

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
    renderContainerTypes({
      renderer,
      typeInfo,
    });
    return;
  }
}
