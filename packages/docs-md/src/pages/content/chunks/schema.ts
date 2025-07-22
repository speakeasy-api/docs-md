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
  data: Map<string, Chunk>;
};

type FrontMatter = {
  description: string | null;
  examples: string[];
  defaultValue: string | null;
};

function getTypeInfo(
  value: SchemaValue,
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
      const typeInfo = getTypeInfo(value.items, context);
      return {
        ...typeInfo,
        label: "array",
        children: [typeInfo],
      };
    }
    case "map": {
      const typeInfo = getTypeInfo(value.items, context);
      return {
        ...typeInfo,
        label: "map",
        children: [typeInfo],
      };
    }
    case "set": {
      const typeInfo = getTypeInfo(value.items, context);
      return {
        ...typeInfo,
        label: "set",
        children: [typeInfo],
      };
    }
    case "union": {
      const displayTypes = value.values.map((v) => getTypeInfo(v, context));
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
      const schemaChunk = getSchemaFromId(value.chunkId, context.data);
      return getTypeInfo(schemaChunk.chunkData.value, context);
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
  frontMatter,
  context,
}: {
  frontMatter: FrontMatter;
  context: SchemaRenderContext;
}) {
  const { showDebugPlaceholders } = getSettings().display;
  if (frontMatter.description) {
    context.renderer.appendText(frontMatter.description);
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No description provided");
    context.renderer.appendDebugPlaceholderEnd();
  }
  if (frontMatter.examples.length > 0) {
    context.renderer.appendText(
      `_${frontMatter.examples.length > 1 ? "Examples" : "Example"}:_`
    );
    for (const example of frontMatter.examples) {
      context.renderer.appendCode(example);
    }
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No examples provided");
    context.renderer.appendDebugPlaceholderEnd();
  }

  if (frontMatter.defaultValue) {
    context.renderer.appendText(
      `_Default Value:_ \`${frontMatter.defaultValue}\``
    );
  } else if (showDebugPlaceholders) {
    context.renderer.appendDebugPlaceholderStart();
    context.renderer.appendText("No default value provided");
    context.renderer.appendDebugPlaceholderEnd();
  }
}

function renderSchemaBreakouts({
  context,
  typeInfo,
}: {
  context: SchemaRenderContext;
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

    // Check if we've reached our maximum level of nesting, and if so break it
    // out into an embed
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
        renderSchema({
          context: {
            ...context,
            schema: breakoutSubType.schema,
            renderer: sidebarLinkRenderer,
            schemaStack: [],
            idPrefix: `${context.idPrefix}+${embedName}`,
          },
          frontMatter: {
            description: breakoutSubType.schema.description,
            examples: [],
            defaultValue: null,
          },
          topLevelName: breakoutSubType.label,
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
      frontMatter: {
        description:
          "description" in breakoutSubType.schema
            ? breakoutSubType.schema.description
            : null,
        examples: [],
        defaultValue: null,
      },
      topLevelName: breakoutSubType.label,
      isExpandable: true,
    });
  }
}

export function renderSchema({
  context,
  frontMatter,
  topLevelName,
  isExpandable,
}: {
  context: SchemaRenderContext;
  frontMatter: FrontMatter;
  topLevelName: string;
  isExpandable?: boolean;
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
        const schemaChunk = getSchemaFromId(value.chunkId, context.data);
        const schema = schemaChunk.chunkData.value;
        const typeInfo = getTypeInfo(schema, context);
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
          frontMatter: {
            description: "description" in schema ? schema.description : null,
            examples: "examples" in schema ? schema.examples : [],
            defaultValue: "defaultValue" in schema ? schema.defaultValue : null,
          },
        });
        renderSchemaBreakouts({
          context,
          typeInfo,
        });
      } else {
        const typeInfo = getTypeInfo(value, context);
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
          frontMatter: {
            description: "description" in value ? value.description : null,
            examples: "examples" in value ? value.examples : [],
            defaultValue: "defaultValue" in value ? value.defaultValue : null,
          },
        });
      }
      context.renderer.appendSectionContentEnd();
    }
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    const typeInfo = getTypeInfo(arrayLikeValue, context);
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
      frontMatter: {
        description:
          "description" in arrayLikeValue ? arrayLikeValue.description : null,
        examples: "examples" in arrayLikeValue ? arrayLikeValue.examples : [],
        defaultValue:
          "defaultValue" in arrayLikeValue ? arrayLikeValue.defaultValue : null,
      },
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    const typeInfo = getTypeInfo(unionValue, context);
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
      frontMatter: {
        description:
          "description" in unionValue ? unionValue.description : null,
        examples: "examples" in unionValue ? unionValue.examples : [],
        defaultValue:
          "defaultValue" in unionValue ? unionValue.defaultValue : null,
      },
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    const typeInfo = getTypeInfo(primitiveValue, context);
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
      frontMatter: {
        description:
          "description" in primitiveValue ? primitiveValue.description : null,
        examples: "examples" in primitiveValue ? primitiveValue.examples : [],
        defaultValue:
          "defaultValue" in primitiveValue ? primitiveValue.defaultValue : null,
      },
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

  if (isExpandable) {
    context.renderer.appendExpandableSectionStart();
    context.renderer.appendSectionTitleStart({
      borderVariant: "none",
      paddingVariant: "none",
    });
    context.renderer.appendHeading(
      HEADINGS.SUB_SECTION_HEADING_LEVEL,
      topLevelName,
      {
        id: context.idPrefix,
      }
    );
    context.renderer.appendSectionTitleEnd();
    context.renderer.appendSectionContentStart();

    renderSchemaFrontmatter({
      context,
      frontMatter,
    });
  } else {
    renderSchemaFrontmatter({
      context,
      frontMatter,
    });
    context.renderer.appendSectionStart({ contentBorderVariant: "all" });
    context.renderer.appendSectionContentStart();
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
    context.renderer.appendSectionContentEnd();
    context.renderer.appendExpandableSectionEnd();
  } else {
    context.renderer.appendSectionContentEnd();
    context.renderer.appendSectionEnd();
  }
}
