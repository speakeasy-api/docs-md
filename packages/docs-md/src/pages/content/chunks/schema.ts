import type { Renderer } from "../../../renderers/base/renderer.ts";
import type { Site } from "../../../renderers/base/site.ts";
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
import { getSchemaFromId } from "../util.ts";

type SchemaRenderContext = {
  site: Site;
  renderer: Renderer;
  baseHeadingLevel: number;
  schemaStack: string[];
  schema: SchemaValue;
  idPrefix: string;
};

function getMaxInlineLength(propertyName: string, indentationLevel: number) {
  return (
    getSettings().display.maxTypeSignatureLineLength -
    propertyName.length -
    indentationLevel
  );
}

// We dont' want to create headings less than this level, because they typically
// have a font size _smaller_ than paragraph font size, which looks weird.
const MIN_HEADING_LEVEL = 5;

type TypeInfo = {
  label: string;
  linkedLabel: string;
  children: TypeInfo[];
  breakoutSubTypes: { label: string; schema: SchemaValue }[];
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
        // TODO: add the link back in. Turns out there are focus issues when
        // the details tab is collapsed. We're going to need a custom React
        // component to auto-expand the details tab when the link is clicked.
        // Fortunately, we're about to introduce a custom component as part of
        // a larger styling refactor, so I'm punting on this for now.
        linkedLabel: value.name,
        // linkedLabel: `<a href="#${context.idPrefix}+${value.name}">${value.name}</a>`,
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

function computeDisplayType(typeInfo: TypeInfo, propertyName: string) {
  const singleLineTypeLabel = computeSingleLineDisplayType(typeInfo);
  // TODO: wire up indentation level here
  if (
    singleLineTypeLabel.unlinked.length < getMaxInlineLength(propertyName, 0)
  ) {
    return {
      content: singleLineTypeLabel.linked,
      multiline: false,
    };
  }
  const content = computeMultilineTypeLabel(typeInfo, 0);

  // TODO: sometimes we end up with some blank lines. Ideally the
  // computeMultilineTypeLabel function should handle this, but for now we just
  // patch it up after the fact
  content.contents = content.contents
    .split("\n")
    .filter((c) => c.trim().length > 0)
    .join("\n");
  return {
    content: content.contents,
    multiline: true,
    length: 0,
  };
}

function computeSingleLineDisplayType(typeInfo: TypeInfo): {
  unlinked: string;
  linked: string;
} {
  switch (typeInfo.label) {
    case "array":
    case "map":
    case "set": {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        unlinked: `${typeInfo.label}&lt;${children.map((c) => c.unlinked).join(",")}&gt;`,
        linked: `${typeInfo.label}&lt;${children.map((c) => c.linked).join(",")}&gt;`,
      };
    }
    case "union":
    case "enum": {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        unlinked: children.map((c) => c.unlinked).join(" | "),
        linked: children.map((c) => c.linked).join(" | "),
      };
    }
    default: {
      return {
        unlinked: typeInfo.label,
        linked: typeInfo.linkedLabel,
      };
    }
  }
}

type MultilineTypeLabelEntry = {
  contents: string;
  multiline: boolean;
};

function computeMultilineTypeLabel(
  typeInfo: TypeInfo,
  indentation: number
): MultilineTypeLabelEntry {
  const { maxTypeSignatureLineLength } = getSettings().display;
  switch (typeInfo.label) {
    case "array":
    case "map":
    case "set": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (
        singleLineContents.unlinked.length <
        maxTypeSignatureLineLength - indentation
      ) {
        return {
          contents: singleLineContents.linked,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(computeMultilineTypeLabel(child, indentation + 1));
      }

      let contents = `${typeInfo.label}&lt;\n`;
      for (const child of children) {
        contents += `${" ".repeat(indentation + 1)}${child.contents}\n`;
      }
      contents += `${" ".repeat(indentation)}&gt;\n`;
      return {
        contents,
        multiline: true,
      };
    }
    case "union":
    case "enum": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (
        singleLineContents.unlinked.length <
        maxTypeSignatureLineLength - indentation
      ) {
        return {
          contents: singleLineContents.linked,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(computeMultilineTypeLabel(child, 0));
      }

      let contents = "\n";
      for (const child of children) {
        contents += `${" ".repeat(indentation)}| ${child.contents}\n`;
      }
      return {
        contents,
        multiline: true,
      };
    }
    default: {
      return {
        contents: typeInfo.label,
        multiline: false,
      };
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
  let annotatedPropertyName = propertyName;
  if (isRequired) {
    annotatedPropertyName = `${propertyName} (required)`;
  }
  if (isRecursive) {
    annotatedPropertyName = `${propertyName} (recursive)`;
  }
  const computedDisplayType = computeDisplayType(
    typeInfo,
    annotatedPropertyName
  );
  if (computedDisplayType.multiline) {
    context.renderer.appendHeading(
      context.baseHeadingLevel,
      annotatedPropertyName,
      {
        id: context.idPrefix + `+${propertyName}`,
      }
    );
    context.renderer.appendCode(computedDisplayType.content, {
      variant: "raw",
      escape: "mdx",
    });
  } else {
    const name = context.renderer.escapeText(annotatedPropertyName, {
      escape: "markdown",
    });
    const type = context.renderer.createCode(
      context.renderer.escapeText(computedDisplayType.content, {
        escape: "mdx",
      }),
      { variant: "raw", style: "inline", escape: "mdx" }
    );
    context.renderer.appendHeading(
      context.baseHeadingLevel,
      `${name}: ${type}`,
      { escape: "none", id: context.idPrefix + `+${propertyName}` }
    );
  }
}

function renderSchemaFrontmatter({
  context,
  propertyName,
  typeInfo,
  isRequired,
}: {
  context: SchemaRenderContext;
  propertyName: string;
  typeInfo: TypeInfo;
  isRequired: boolean;
}) {
  renderNameAndType({
    context,
    propertyName,
    typeInfo: typeInfo,
    isRequired,
    isRecursive: false,
  });

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
        sidebarLinkRenderer.appendHeading(context.baseHeadingLevel, embedName);
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
        });
      }
      continue;
    }

    // Otherwise, render the schema inline
    renderSchema({
      context: {
        ...context,
        schema: breakoutSubType.schema,
        baseHeadingLevel: Math.min(
          context.baseHeadingLevel + 1,
          MIN_HEADING_LEVEL
        ),
        schemaStack: [...context.schemaStack, breakoutSubType.label],
        idPrefix: `${context.idPrefix}+${breakoutSubType.label}`,
      },
      data,
      topLevelName: breakoutSubType.label,
    });
  }
}

export function renderSchema({
  context,
  data,
  topLevelName,
}: {
  context: SchemaRenderContext;
  data: Map<string, Chunk>;
  topLevelName: string;
}) {
  function renderObjectProperties(objectValue: ObjectValue) {
    context.renderer.appendExpandableSectionStart(topLevelName, {
      isOpenOnLoad: context.schemaStack.length === 0,
    });
    for (const [key, value] of Object.entries(objectValue.properties)) {
      const isRequired = objectValue.required?.includes(key) ?? false;
      if (value.type === "chunk") {
        const schemaChunk = getSchemaFromId(value.chunkId, data);
        const schema = schemaChunk.chunkData.value;
        const typeInfo = getTypeInfo(schema, data, context);
        renderSchemaFrontmatter({
          context: { ...context, schema },
          propertyName: key,
          typeInfo: typeInfo,
          isRequired,
        });
        renderSchemaBreakouts({
          context,
          data,
          typeInfo,
        });
      } else if (value.type === "enum") {
        const typeInfo = getTypeInfo(value, data, context);
        renderSchemaFrontmatter({
          context: { ...context, schema: value },
          propertyName: key,
          typeInfo: typeInfo,
          isRequired,
        });
      } else {
        const typeInfo = getTypeInfo(value, data, context);
        renderSchemaFrontmatter({
          context: { ...context, schema: value },
          propertyName: key,
          typeInfo: typeInfo,
          isRequired,
        });
      }
    }
    context.renderer.appendExpandableSectionEnd();
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    const typeInfo = getTypeInfo(arrayLikeValue, data, context);
    renderSchemaFrontmatter({
      context: { ...context, schema: arrayLikeValue },
      propertyName: topLevelName,
      typeInfo: typeInfo,
      isRequired: true,
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    const typeInfo = getTypeInfo(unionValue, data, context);
    renderSchemaFrontmatter({
      context: { ...context, schema: unionValue },
      propertyName: topLevelName,
      typeInfo: typeInfo,
      isRequired: true,
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    const typeInfo = getTypeInfo(primitiveValue, data, context);
    renderSchemaFrontmatter({
      context: { ...context, schema: primitiveValue },
      propertyName: topLevelName,
      typeInfo: typeInfo,
      isRequired: true,
    });
  }

  switch (context.schema.type) {
    case "object": {
      renderObjectProperties(context.schema);
      break;
    }
    case "map":
    case "set":
    case "array": {
      renderArrayLikeItems(context.schema);
      break;
    }
    case "union": {
      renderUnionItems(context.schema);
      break;
    }
    default: {
      renderBasicItems(context.schema);
      break;
    }
  }
}
