import type {
  PropertyAnnotations,
  Renderer,
  Site,
  TypeInfo,
} from "../../../renderers/base/base.ts";
import type {
  ArrayValue,
  Chunk,
  MapValue,
  ObjectValue,
  SchemaValue,
  SetValue,
  UnionValue,
} from "../../../types/chunk.ts";
import { assertNever } from "../../../util/assertNever.ts";
import { InternalError } from "../../../util/internalError.ts";
import { getSettings } from "../../../util/settings.ts";
import { HEADINGS } from "../constants.ts";
import { getSchemaFromId } from "../util.ts";

type SchemaRenderContext = {
  site: Site;
  renderer: Renderer;
  schemaStack: string[];
  schema: SchemaValue;
  idPrefix: string;
};

function getTypeInfo(
  value: SchemaValue,
  data: Map<string, Chunk>,
  context: SchemaRenderContext
): TypeInfo {
  switch (value.type) {
    case "object": {
      return {
        label: value.name,
        linkedLabel: `<a href="#${context.idPrefix}+${value.name}">${value.name}</a>`,
        children: [],
        breakoutSubTypes: [{ label: value.name, schema: value }],
      };
    }
    case "array": {
      const typeInfo = getTypeInfo(value.items, data, context);
      return {
        ...typeInfo,
        label: "array",
        children: [typeInfo],
      };
    }
    case "map": {
      const typeInfo = getTypeInfo(value.items, data, context);
      return {
        ...typeInfo,
        label: "map",
        children: [typeInfo],
      };
    }
    case "set": {
      const typeInfo = getTypeInfo(value.items, data, context);
      return {
        ...typeInfo,
        label: "set",
        children: [typeInfo],
      };
    }
    case "union": {
      const displayTypes = value.values.map((v) =>
        getTypeInfo(v, data, context)
      );
      const hasBreakoutSubType = displayTypes.some(
        (d) => d.breakoutSubTypes.length > 0
      );
      if (!hasBreakoutSubType) {
        return {
          label: "union",
          linkedLabel: "union",
          children: displayTypes,
          breakoutSubTypes: [],
        };
      }
      const breakoutSubTypes = displayTypes.flatMap((d) => d.breakoutSubTypes);
      return {
        label: "union",
        linkedLabel: "union",
        children: displayTypes,
        breakoutSubTypes,
      };
    }
    case "chunk": {
      const schemaChunk = getSchemaFromId(value.chunkId, data);
      return getTypeInfo(schemaChunk.chunkData.value, data, context);
    }
    case "enum": {
      return {
        label: "enum",
        linkedLabel: "enum",
        children: value.values.map((v) => {
          const label = `${typeof v === "string" ? `"${v}"` : v}`;
          return {
            label,
            linkedLabel: label,
            children: [],
            breakoutSubTypes: [],
          };
        }),
        breakoutSubTypes: [],
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
        label: value.type,
        linkedLabel: value.type,
        children: [],
        breakoutSubTypes: [],
      };
    }
    default: {
      assertNever(value);
    }
  }
}

function renderNameAndType({
  context,
  propertyName,
  typeInfo,
  isRequired,
  isRecursive,
}: {
  context: SchemaRenderContext;
  propertyName: string;
  typeInfo: TypeInfo;
  isRequired: boolean;
  isRecursive: boolean;
}) {
  const annotations: PropertyAnnotations[] = [];
  if (isRequired) {
    annotations.push({ title: "required", variant: "warning" });
  }
  if (isRecursive) {
    annotations.push({ title: "recursive", variant: "info" });
  }
  context.renderer.appendProperty({
    typeInfo,
    id: context.idPrefix + `+${propertyName}`,
    annotations,
    title: propertyName,
  });
}

function renderSchemaFrontmatter({
  context,
}: {
  context: SchemaRenderContext;
}) {
  if ("description" in context.schema && context.schema.description) {
    context.renderer.appendText(context.schema.description);
  }
  if ("examples" in context.schema && context.schema.examples.length > 0) {
    context.renderer.appendText(
      `_${context.schema.examples.length > 1 ? "Examples" : "Example"}:_`
    );
    for (const example of context.schema.examples) {
      context.renderer.appendCode(example);
    }
  }

  if ("defaultValue" in context.schema && context.schema.defaultValue) {
    context.renderer.appendText(
      `_Default Value:_ \`${context.schema.defaultValue}\``
    );
  }
}

function renderSchemaBreakouts({
  context,
  data,
  typeInfo,
}: {
  context: SchemaRenderContext;
  data: Map<string, Chunk>;
  typeInfo: TypeInfo;
}) {
  const { maxSchemaNesting } = getSettings().display;
  for (let i = 0; i < typeInfo.breakoutSubTypes.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const breakoutSubType = typeInfo.breakoutSubTypes[i]!;

    // TODO: this is a quick-n-dirty deduping of breakout types, but if there are
    // two different schemas with the same name they'll be deduped, which is wrong.
    if (
      typeInfo.breakoutSubTypes.findIndex(
        (b) => b.label === breakoutSubType.label
      ) !== i
    ) {
      continue;
    }

    // Check if this is a circular reference, add a brief note
    if (context.schemaStack.includes(breakoutSubType.label)) {
      if (breakoutSubType.schema.type !== "object") {
        throw new InternalError("Schema must be an object to be embedded");
      }
      // TODO: add fragment link if we're not in a sidebar
      context.renderer.appendText(
        `\`${breakoutSubType.schema.name}\` is circular. See previous description for details.`
      );
      continue;
    }

    // Check if we've reached our maximum level of nesting, or if there's
    // indirect type recursion, and if so break it out into an embed
    if (context.schemaStack.length >= maxSchemaNesting) {
      // This shouldn't be possible, since we only recurse on objects
      if (breakoutSubType.schema.type !== "object") {
        throw new InternalError("Schema must be an object to be embedded");
      }
      const embedName = breakoutSubType.schema.name;
      const sidebarLinkRenderer = context.renderer.appendSidebarLink({
        title: `${embedName} Details`,
        embedName,
      });

      // If no renderer was returned, that means we've already rendered this embed
      if (sidebarLinkRenderer) {
        sidebarLinkRenderer.appendHeading(
          HEADINGS.SECTION_HEADING_LEVEL,
          embedName
        );
        if (breakoutSubType.schema.description) {
          sidebarLinkRenderer.appendText(breakoutSubType.schema.description);
        }
        renderSchema({
          context: {
            ...context,
            schema: breakoutSubType.schema,
            renderer: sidebarLinkRenderer,
            schemaStack: [],
            idPrefix: `${context.idPrefix}+${embedName}`,
          },
          data,
          topLevelName: breakoutSubType.label,
          renderFrontmatter: true,
        });
      }
      continue;
    }

    // Otherwise, render the schema inline
    renderSchema({
      context: {
        ...context,
        schema: breakoutSubType.schema,
        schemaStack: [...context.schemaStack, breakoutSubType.label],
        idPrefix: `${context.idPrefix}+${breakoutSubType.label}`,
      },
      data,
      topLevelName: breakoutSubType.label,
      isExpandable: true,
      renderFrontmatter: true,
    });
  }
}

export function renderSchema({
  context,
  data,
  topLevelName,
  isExpandable,
  renderFrontmatter,
}: {
  context: SchemaRenderContext;
  data: Map<string, Chunk>;
  topLevelName: string;
  isExpandable?: boolean;
  renderFrontmatter?: boolean;
}) {
  function renderObjectProperties(objectValue: ObjectValue) {
    const properties = Object.entries(objectValue.properties);
    if (!properties.length) {
      return;
    }
    for (const [key, value] of properties) {
      context.renderer.appendSectionContentStart({ borderVariant: "all" });
      const isRequired = objectValue.required?.includes(key) ?? false;

      if (value.type === "chunk") {
        const schemaChunk = getSchemaFromId(value.chunkId, data);
        const schema = schemaChunk.chunkData.value;
        const typeInfo = getTypeInfo(schema, data, context);
        const nestedContext = {
          ...context,
          schema,
        };

        renderNameAndType({
          context: nestedContext,
          propertyName: key,
          typeInfo: typeInfo,
          isRequired,
          isRecursive: false,
        });
        renderSchemaFrontmatter({
          context: nestedContext,
        });
        renderSchemaBreakouts({
          context,
          data,
          typeInfo,
        });
      } else {
        const typeInfo = getTypeInfo(value, data, context);
        const nestedContext = {
          ...context,
          schema: value,
        };
        renderNameAndType({
          context: nestedContext,
          propertyName: key,
          typeInfo: typeInfo,
          isRequired,
          isRecursive: false,
        });
        renderSchemaFrontmatter({
          context: nestedContext,
        });
      }
      context.renderer.appendSectionContentEnd();
    }
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    const typeInfo = getTypeInfo(arrayLikeValue, data, context);
    const nestedContext = {
      ...context,
      schema: arrayLikeValue,
    };
    renderNameAndType({
      context: nestedContext,
      propertyName: topLevelName,
      typeInfo,
      isRequired: true,
      isRecursive: false,
    });
    renderSchemaFrontmatter({
      context: nestedContext,
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    const typeInfo = getTypeInfo(unionValue, data, context);
    const nestedContext = {
      ...context,
      schema: unionValue,
    };
    renderNameAndType({
      context: nestedContext,
      propertyName: topLevelName,
      typeInfo,
      isRequired: true,
      isRecursive: false,
    });
    renderSchemaFrontmatter({
      context: nestedContext,
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    const typeInfo = getTypeInfo(primitiveValue, data, context);
    const nestedContext = {
      ...context,
      schema: primitiveValue,
    };
    renderNameAndType({
      context: nestedContext,
      propertyName: topLevelName,
      typeInfo,
      isRequired: true,
      isRecursive: false,
    });
    renderSchemaFrontmatter({
      context: nestedContext,
    });
  }

  // If we have an object, we need to check if there are any properties to
  // render, otherwise we end up with a blank Properties section.
  if (
    context.schema.type === "object" &&
    Object.keys(context.schema.properties).length === 0
  ) {
    return;
  }

  // TODO: refactor starting sections here to not be brittle and awkward
  if (isExpandable) {
    context.renderer.appendExpandableSectionStart(topLevelName, {
      id: context.idPrefix,
    });
    if (renderFrontmatter) {
      renderSchemaFrontmatter({
        context,
      });
    }
    context.renderer.appendHeading(
      HEADINGS.SUB_SECTION_HEADING_LEVEL,
      "Properties",
      {
        id: context.idPrefix + "+properties",
      }
    );
  } else {
    if (renderFrontmatter) {
      renderSchemaFrontmatter({
        context,
      });
    }
    context.renderer.appendSectionStart();
    context.renderer.appendSectionTitleStart({ borderVariant: "none" });
    context.renderer.appendHeading(
      HEADINGS.SUB_SECTION_HEADING_LEVEL,
      "Properties",
      {
        id: context.idPrefix + "+properties",
      }
    );
    context.renderer.appendSectionTitleEnd();
  }

  switch (context.schema.type) {
    case "object": {
      renderObjectProperties(context.schema);
      break;
    }
    case "map":
    case "set":
    case "array": {
      context.renderer.appendSectionContentStart({ borderVariant: "all" });
      renderArrayLikeItems(context.schema);
      context.renderer.appendSectionContentEnd();
      break;
    }
    case "union": {
      context.renderer.appendSectionContentStart({ borderVariant: "all" });
      renderUnionItems(context.schema);
      context.renderer.appendSectionContentEnd();
      break;
    }
    default: {
      context.renderer.appendSectionContentStart({ borderVariant: "all" });
      renderBasicItems(context.schema);
      context.renderer.appendSectionContentEnd();
      break;
    }
  }
  if (isExpandable) {
    context.renderer.appendExpandableSectionEnd();
  } else {
    context.renderer.appendSectionEnd();
  }
}
