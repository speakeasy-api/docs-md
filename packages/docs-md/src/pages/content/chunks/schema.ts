import type {
  DisplayTypeInfo,
  PropertyAnnotations,
  Renderer,
  Site,
} from "../../../renderers/base/base.ts";
import type { Chunk, ObjectValue, SchemaValue } from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { InternalError } from "../../../util/internalError.ts";
import { getSettings } from "../../../util/settings.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";

type SchemaRenderContext = {
  site: Site;
  renderer: Renderer;
  schemaStack: string[];
  idPrefix: string;
  data: Map<string, Chunk>;
};

type ContainerEntry = {
  label: string;
  schema: ObjectValue;
};

type Property = {
  name: string;
  isRequired: boolean;
  isDeprecated: boolean;
  schema: SchemaValue;
};

/* ---- Helpers ---- */

function getDisplayTypeInfo(
  schema: SchemaValue,
  context: SchemaRenderContext
): DisplayTypeInfo {
  switch (schema.type) {
    case "object": {
      return {
        label: schema.name,
        linkedLabel: `<a href="#${context.idPrefix}+${schema.name}">${schema.name}</a>`,
        children: [],
        breakoutSubTypes: new Map([[schema.name, schema]]),
      };
    }
    case "array": {
      const typeInfo = getDisplayTypeInfo(schema.items, context);
      return {
        ...typeInfo,
        label: "array",
        children: [typeInfo],
      };
    }
    case "map": {
      const typeInfo = getDisplayTypeInfo(schema.items, context);
      return {
        ...typeInfo,
        label: "map",
        children: [typeInfo],
      };
    }
    case "set": {
      const typeInfo = getDisplayTypeInfo(schema.items, context);
      return {
        ...typeInfo,
        label: "set",
        children: [typeInfo],
      };
    }
    case "union": {
      const displayTypes = schema.values.map((v) =>
        getDisplayTypeInfo(v, context)
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
      const schemaChunk = getSchemaFromId(schema.chunkId, context.data);
      return getDisplayTypeInfo(schemaChunk.chunkData.value, context);
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

function renderFrontmatter({
  context,
  description,
  examples,
  defaultValue,
}: {
  context: SchemaRenderContext;
  description: string | null;
  examples: string[];
  defaultValue: string | null;
}) {
  const { showDebugPlaceholders } = getSettings().display;
  if (description) {
    context.renderer.appendText(description);
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No description provided");
    context.renderer.appendDebugPlaceholderEnd();
  }
  if (examples.length > 0) {
    context.renderer.appendText(
      `_${examples.length > 1 ? "Examples" : "Example"}:_`
    );
    for (const example of examples) {
      context.renderer.appendCode(example);
    }
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No examples provided");
    context.renderer.appendDebugPlaceholderEnd();
  }

  if (defaultValue) {
    context.renderer.appendText(`_Default Value:_ \`${defaultValue}\``);
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No default value provided");
    context.renderer.appendDebugPlaceholderEnd();
  }
}

/* ---- Intermediary Rendering ---- */

function renderBreakout({
  context,
  breakout,
}: {
  context: SchemaRenderContext;
  breakout: ContainerEntry;
}) {
  context.renderer.appendExpandableSectionStart();
  context.renderer.appendSectionTitleStart({
    borderVariant: "none",
    paddingVariant: "none",
  });
  context.renderer.appendHeading(
    HEADINGS.SUB_SECTION_HEADING_LEVEL,
    breakout.label,
    {
      id: context.idPrefix,
    }
  );
  context.renderer.appendSectionTitleEnd();
  context.renderer.appendSectionContentStart();

  const breakoutContext = {
    ...context,
    schemaStack: [...context.schemaStack, breakout.label],
    idPrefix: `${context.idPrefix}+${breakout.label}`,
  };

  renderSchemaFrontmatter({
    context: breakoutContext,
    schema: breakout.schema,
  });

  renderObject({
    context: breakoutContext,
    schema: breakout.schema,
  });

  context.renderer.appendSectionContentEnd();
  context.renderer.appendExpandableSectionEnd();
}

function renderSidebar({
  context,
  sidebar,
}: {
  context: SchemaRenderContext;
  sidebar: ContainerEntry;
}) {
  const sidebarLinkRenderer = context.renderer.appendSidebarLink({
    title: sidebar.label,
    embedName: sidebar.label,
  });

  // If no renderer was returned, that means we've already rendered this embed
  if (!sidebarLinkRenderer) {
    return;
  }

  const sidebarContext = {
    ...context,
    renderer: sidebarLinkRenderer,
    // Reset the schema stack since we're in a sidebar
    schemaStack: [],
    idPrefix: `${context.idPrefix}+${sidebar.label}`,
  };

  sidebarLinkRenderer.appendHeading(
    HEADINGS.SECTION_HEADING_LEVEL,
    sidebar.label
  );

  renderSchemaFrontmatter({
    context: sidebarContext,
    schema: sidebar.schema,
  });

  renderObject({
    context: sidebarContext,
    schema: sidebar.schema,
  });
}

function renderProperty({
  context,
  property,
}: {
  context: SchemaRenderContext;
  property: Property;
}) {
  // Render type signature
  const typeInfo = getDisplayTypeInfo(property.schema, context);
  const annotations: PropertyAnnotations[] = [];
  if (property.isRequired) {
    annotations.push({ title: "required", variant: "warning" });
  }
  if (property.isDeprecated) {
    annotations.push({ title: "deprecated", variant: "warning" });
  }

  const id = `${context.idPrefix}+${property.name}`;

  context.renderer.appendProperty({
    typeInfo,
    id,
    annotations,
    title: property.name,
  });

  const propertyContext = {
    ...context,
    idPrefix: id,
  };

  // Render front matter
  renderSchemaFrontmatter({
    context: propertyContext,
    schema: property.schema,
  });

  renderSchemaDetails({
    context: propertyContext,
    schema: property.schema,
  });
}

/* ---- Section Rendering ---- */

function renderObject({
  context,
  schema,
}: {
  context: SchemaRenderContext;
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
    renderProperty({
      context,
      property,
    });
  }
}

function renderContainer({
  context,
  typeInfo,
}: {
  context: SchemaRenderContext;
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
  const isSidebar =
    context.schemaStack.length >= getSettings().display.maxSchemaNesting;
  for (const entry of entries) {
    if (isSidebar) {
      renderSidebar({
        context,
        sidebar: entry,
      });
    } else {
      renderBreakout({
        context,
        breakout: entry,
      });
    }
  }
}

/* ---- Root ---- */

export function renderSchemaFrontmatter({
  schema,
  context,
}: {
  context: SchemaRenderContext;
  schema: SchemaValue;
}) {
  renderFrontmatter({
    description: "description" in schema ? schema.description : null,
    examples: "examples" in schema ? schema.examples : [],
    defaultValue: "defaultValue" in schema ? schema.defaultValue : null,
    context,
  });
}

export function renderSchemaDetails({
  context,
  schema,
}: {
  context: SchemaRenderContext;
  schema: SchemaValue;
}) {
  const typeInfo = getDisplayTypeInfo(schema, context);

  // Check if this is an object, and if so render its properties
  if (schema.type === "object") {
    renderObject({
      context,
      schema,
    });
    return;
  }
  // Check if this is a container, and if so render breakouts
  else if (typeInfo.breakoutSubTypes.size > 0) {
    renderContainer({
      context,
      typeInfo,
    });
    return;
  }
  // Otherwise this is a primitive and we don't need to do anything
}
