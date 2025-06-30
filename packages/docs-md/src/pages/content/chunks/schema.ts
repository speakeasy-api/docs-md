import type {
  ArrayValue,
  Chunk,
  MapValue,
  ObjectValue,
  SchemaValue,
  SetValue,
  UnionValue,
} from "../../../types/chunk.ts";
import type { Renderer } from "../../../renderers/base/renderer.ts";
import type { Site } from "../../../renderers/base/site.ts";
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

type TypeLabel = {
  label: string;
  children: TypeLabel[];
};

type DisplayType = {
  typeLabel: TypeLabel;
  breakoutSubTypes: { label: string; schema: SchemaValue }[];
};

function getDisplayType(
  value: SchemaValue,
  data: Map<string, Chunk>
): DisplayType {
  switch (value.type) {
    case "object": {
      return {
        typeLabel: { label: value.name, children: [] },
        breakoutSubTypes: [{ label: value.name, schema: value }],
      };
    }
    case "array": {
      const displayType = getDisplayType(value.items, data);
      return {
        ...displayType,
        typeLabel: { label: "array", children: [displayType.typeLabel] },
      };
    }
    case "map": {
      const displayType = getDisplayType(value.items, data);
      return {
        ...displayType,
        typeLabel: { label: "map", children: [displayType.typeLabel] },
      };
    }
    case "set": {
      const displayType = getDisplayType(value.items, data);
      return {
        ...displayType,
        typeLabel: { label: "set", children: [displayType.typeLabel] },
      };
    }
    case "union": {
      const displayTypes = value.values.map((v) => getDisplayType(v, data));
      const hasBreakoutSubType = displayTypes.some(
        (d) => d.breakoutSubTypes.length > 0
      );
      if (!hasBreakoutSubType) {
        return {
          typeLabel: {
            label: "union",
            children: displayTypes.map((d) => d.typeLabel),
          },
          breakoutSubTypes: [],
        };
      }
      const breakoutSubTypes = displayTypes.flatMap((d) => d.breakoutSubTypes);
      return {
        typeLabel: {
          label: "union",
          children: displayTypes.map((d) => d.typeLabel),
        },
        breakoutSubTypes,
      };
    }
    case "chunk": {
      const schemaChunk = getSchemaFromId(value.chunkId, data);
      return getDisplayType(schemaChunk.chunkData.value, data);
    }
    case "enum": {
      return {
        typeLabel: {
          label: "enum",
          children: value.values.map((v) => ({
            label: `${typeof v === "string" ? `"${v}"` : v}`,
            children: [],
          })),
        },
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
        typeLabel: { label: value.type, children: [] },
        breakoutSubTypes: [],
      };
    }
    default: {
      assertNever(value);
    }
  }
}

function computeDisplayType(typeLabel: TypeLabel, propertyName: string) {
  const singleLineTypeLabel = computeSingleLineDisplayType(typeLabel);
  // TODO: wire up indentation level here
  if (singleLineTypeLabel.length < getMaxInlineLength(propertyName, 0)) {
    return {
      content: singleLineTypeLabel,
      multiline: false,
    };
  }
  const content = computeMultilineTypeLabel(typeLabel, 0);

  // TODO: sometimes we end up with some blank lines. Ideally the
  // computeMultilineTypeLabel function should handle this, but for now we just
  // patch it up after the fact
  content.contents = content.contents
    .split("\n")
    .filter((c) => c.length > 0)
    .join("\n");
  return {
    content: content.contents,
    multiline: true,
  };
}

function computeSingleLineDisplayType(typeLabel: TypeLabel): string {
  switch (typeLabel.label) {
    case "array":
    case "map":
    case "set": {
      return `${typeLabel.label}<${typeLabel.children.map(computeSingleLineDisplayType).join(",")}>`;
    }
    case "union":
    case "enum": {
      return typeLabel.children.map(computeSingleLineDisplayType).join(" | ");
    }
    default: {
      return typeLabel.label;
    }
  }
}

type MultilineTypeLabelEntry = {
  contents: string;
  multiline: boolean;
};

function computeMultilineTypeLabel(
  typeLabel: TypeLabel,
  indentation: number
): MultilineTypeLabelEntry {
  const { maxTypeSignatureLineLength } = getSettings().display;
  switch (typeLabel.label) {
    case "array":
    case "map":
    case "set": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeLabel);
      if (
        singleLineContents.length <
        maxTypeSignatureLineLength - indentation
      ) {
        return {
          contents: singleLineContents,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeLabel.children) {
        children.push(computeMultilineTypeLabel(child, indentation + 1));
      }

      let contents = `${typeLabel.label}<\n`;
      for (const child of children) {
        contents += `${" ".repeat(indentation + 1)}${child.contents}\n`;
      }
      contents += `${" ".repeat(indentation)}>\n`;
      return {
        contents,
        multiline: true,
      };
    }
    case "union":
    case "enum": {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeLabel);
      if (
        singleLineContents.length <
        maxTypeSignatureLineLength - indentation
      ) {
        return {
          contents: singleLineContents,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeLabel.children) {
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
        contents: typeLabel.label,
        multiline: false,
      };
    }
  }
}

function renderNameAndType({
  context,
  propertyName,
  displayType,
  isRequired,
  isRecursive,
}: {
  context: SchemaRenderContext;
  propertyName: string;
  displayType: DisplayType;
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
    displayType.typeLabel,
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
    context.renderer.appendCodeBlock(computedDisplayType.content, {
      variant: "raw",
    });
  } else {
    context.renderer.appendHeading(
      context.baseHeadingLevel,
      `${context.renderer.escapeText(annotatedPropertyName, { escape: "markdown" })}: \`${context.renderer.escapeText(computedDisplayType.content, { escape: "mdx" })}\``,
      { escape: "none", id: context.idPrefix + `+${propertyName}` }
    );
  }
}

function renderSchemaFrontmatter({
  context,
  propertyName,
  displayType,
  isRequired,
}: {
  context: SchemaRenderContext;
  propertyName: string;
  displayType: DisplayType;
  isRequired: boolean;
}) {
  renderNameAndType({
    context,
    propertyName,
    displayType,
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
      context.renderer.appendCodeBlock(example);
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
  displayType,
}: {
  context: SchemaRenderContext;
  data: Map<string, Chunk>;
  displayType: DisplayType;
}) {
  const { maxSchemaNesting } = getSettings().display;
  for (let i = 0; i < displayType.breakoutSubTypes.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const breakoutSubType = displayType.breakoutSubTypes[i]!;

    // TODO: this is a quick-n-dirty deduping of breakout types, but if there are
    // two different schemas with the same name they'll be deduped, which is wrong.
    if (
      displayType.breakoutSubTypes.findIndex(
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
        const displayType = getDisplayType(schema, data);
        renderSchemaFrontmatter({
          context: { ...context, schema },
          propertyName: key,
          displayType,
          isRequired,
        });
        renderSchemaBreakouts({
          context,
          data,
          displayType,
        });
      } else if (value.type === "enum") {
        const displayType = getDisplayType(value, data);
        renderSchemaFrontmatter({
          context: { ...context, schema: value },
          propertyName: key,
          displayType,
          isRequired,
        });
      } else {
        const displayType = getDisplayType(value, data);
        renderSchemaFrontmatter({
          context: { ...context, schema: value },
          propertyName: key,
          displayType,
          isRequired,
        });
      }
    }
    context.renderer.appendExpandableSectionEnd();
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    const displayType = getDisplayType(arrayLikeValue, data);
    renderSchemaFrontmatter({
      context: { ...context, schema: arrayLikeValue },
      propertyName: topLevelName,
      displayType,
      isRequired: true,
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    const displayType = getDisplayType(unionValue, data);
    renderSchemaFrontmatter({
      context: { ...context, schema: unionValue },
      propertyName: topLevelName,
      displayType,
      isRequired: true,
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    const displayType = getDisplayType(primitiveValue, data);
    renderSchemaFrontmatter({
      context: { ...context, schema: primitiveValue },
      propertyName: topLevelName,
      displayType,
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
