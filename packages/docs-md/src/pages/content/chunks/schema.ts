import type {
  DisplayTypeInfo,
  PropertyAnnotations,
  Renderer,
} from "../../../renderers/base/base.ts";
import type { ObjectValue, SchemaValue } from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { InternalError } from "../../../util/internalError.ts";
import { getSettings } from "../../../util/settings.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";

type ContainerEntry = {
  label: string;
  schema: ObjectValue;
};

/* ---- Helpers ---- */

function getDisplayTypeInfo(
  schema: SchemaValue,
  renderer: Renderer
): DisplayTypeInfo {
  switch (schema.type) {
    case "object": {
      return {
        label: schema.name,
        linkedLabel: `<a href="#${renderer.getCurrentId()}+${schema.name}">${schema.name}</a>`,
        children: [],
        breakoutSubTypes: new Map([[schema.name, schema]]),
      };
    }
    case "array": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer);
      return {
        ...typeInfo,
        label: "array",
        children: [typeInfo],
      };
    }
    case "map": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer);
      return {
        ...typeInfo,
        label: "map",
        children: [typeInfo],
      };
    }
    case "set": {
      const typeInfo = getDisplayTypeInfo(schema.items, renderer);
      return {
        ...typeInfo,
        label: "set",
        children: [typeInfo],
      };
    }
    case "union": {
      const displayTypes = schema.values.map((v) =>
        getDisplayTypeInfo(v, renderer)
      );
      const hasBreakoutSubType = displayTypes.some(
        (d) => d.breakoutSubTypes.size > 0
      );
      if (!hasBreakoutSubType) {
        return {
          label: "union",
          linkedLabel: "union",
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
        label: "union",
        linkedLabel: "union",
        children: displayTypes,
        breakoutSubTypes,
      };
    }
    case "chunk": {
      const schemaChunk = getSchemaFromId(
        schema.chunkId,
        renderer.getDocsData()
      );
      return getDisplayTypeInfo(schemaChunk.chunkData.value, renderer);
    }
    case "enum": {
      return {
        label: "enum",
        linkedLabel: "enum",
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
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    description || examples.length > 0 || defaultValue || showDebugPlaceholders
  );
}

/* ---- Intermediary Rendering ---- */

function renderSidebar({
  renderer,
  sidebar,
}: {
  renderer: Renderer;
  sidebar: ContainerEntry;
}) {
  const sidebarLinkRenderer = renderer.appendSidebarLink({
    title: sidebar.label,
    embedName: sidebar.label,
  });

  // If no renderer was returned, that means we've already rendered this embed
  if (!sidebarLinkRenderer) {
    return;
  }

  // TODO: this needs a fresh context stack
  renderer.enterContext(sidebar.label);

  sidebarLinkRenderer.appendHeading(
    HEADINGS.SECTION_HEADING_LEVEL,
    sidebar.label
  );

  renderSchemaFrontmatter({
    renderer,
    schema: sidebar.schema,
  });

  renderObjectProperties({
    renderer,
    schema: sidebar.schema,
  });

  renderer.exitContext();
}

/* ---- Section Rendering ---- */

function renderObjectProperties({
  renderer,
  schema,
}: {
  renderer: Renderer;
  schema: ObjectValue;
}) {
  const properties = Object.entries(schema.properties).map(
    ([name, propertySchema]) => {
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
    renderer.enterContext(property.name);

    // Render the expandable entry
    const typeInfo = getDisplayTypeInfo(property.schema, renderer);
    const annotations: PropertyAnnotations[] = [];
    if (property.isRequired) {
      annotations.push({ title: "required", variant: "warning" });
    }
    if (property.isDeprecated) {
      annotations.push({ title: "deprecated", variant: "warning" });
    }
    const hasFrontmatter = hasSchemaFrontmatter(property.schema);
    renderer.addExpandableProperty({
      typeInfo,
      annotations,
      title: property.name,
      createContent: hasFrontmatter
        ? () => {
            renderSchemaFrontmatter({
              renderer,
              schema: property.schema,
            });
          }
        : undefined,
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

  // TODO: reenable this once we implement a new sidebar
  // const isSidebar =
  //   renderer.getContextStack().length >= getSettings().display.maxSchemaNesting;
  const isSidebar = false;
  for (const breakout of entries) {
    if (isSidebar) {
      renderSidebar({
        renderer,
        sidebar: breakout,
      });
      return;
    }

    if (renderer.alreadyInContext(breakout.label)) {
      // TODO: handle this better
      continue;
    }
    renderer.enterContext(breakout.label);

    const hasFrontmatter = hasSchemaFrontmatter(breakout.schema);
    renderer.addExpandableBreakout({
      createTitle: () => {
        renderer.appendHeading(
          HEADINGS.SUB_SECTION_HEADING_LEVEL,
          breakout.label,
          {
            id: renderer.getCurrentId(),
          }
        );
      },
      createContent: hasFrontmatter
        ? () => {
            renderSchemaFrontmatter({
              renderer,
              schema: breakout.schema,
            });
          }
        : undefined,
    });

    renderObjectProperties({
      renderer,
      schema: breakout.schema,
    });

    renderer.exitContext();
  }
}

/* ---- Root ---- */

export function renderSchemaFrontmatter({
  schema,
  renderer,
}: {
  renderer: Renderer;
  schema: SchemaValue;
}) {
  const description = "description" in schema ? schema.description : null;
  const examples = "examples" in schema ? schema.examples : [];
  const defaultValue = "defaultValue" in schema ? schema.defaultValue : null;
  const { showDebugPlaceholders } = getSettings().display;
  if (description) {
    renderer.appendText(description);
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No description provided");
    renderer.appendDebugPlaceholderEnd();
  }
  if (examples.length > 0) {
    renderer.appendText(`_${examples.length > 1 ? "Examples" : "Example"}:_`);
    for (const example of examples) {
      renderer.appendCode(example);
    }
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No examples provided");
    renderer.appendDebugPlaceholderEnd();
  }

  if (defaultValue) {
    renderer.appendText(`_Default Value:_ \`${defaultValue}\``);
  } else if (showDebugPlaceholders) {
    renderer.appendDebugPlaceholderStart();
    renderer.appendText("No default value provided");
    renderer.appendDebugPlaceholderEnd();
  }
}

export function renderBreakouts({
  renderer,
  schema,
}: {
  renderer: Renderer;
  schema: SchemaValue;
}) {
  const typeInfo = getDisplayTypeInfo(schema, renderer);

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
