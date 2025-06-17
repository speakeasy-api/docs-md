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
import { getSettings } from "../../settings.ts";
import type { Renderer, Site } from "../renderer.ts";
import { getSchemaFromId } from "../util.ts";

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

type RenderSchemaOptions = {
  site: Site;
  renderer: Renderer;
  schema: SchemaValue;
  data: Map<string, Chunk>;
  baseHeadingLevel: number;
  depth: number;
};

type TypeLabel = {
  label: string;
  children: TypeLabel[];
};

type DisplayType = {
  typeLabel: TypeLabel;
  breakoutSubTypes: Array<{ label: string; schema: SchemaValue }>;
};

function getDisplayType(
  value: SchemaValue,
  data: Map<string, Chunk>
): DisplayType {
  switch (value.type) {
    case "object": {
      return {
        typeLabel: { label: value.name, children: [] },
        breakoutSubTypes: [
          { label: `${value.name} Properties`, schema: value },
        ],
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
        typeLabel: { label: "enum", children: [] },
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
      for (let i = 0; i < children.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const child = children[i]!;
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
      for (let i = 0; i < children.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const child = children[i]!;
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

function renderSchemaFrontmatter({
  renderer,
  site,
  schema,
  baseHeadingLevel,
  data,
  depth,
  propertyName,
}: RenderSchemaOptions & { propertyName: string }) {
  const displayType = getDisplayType(schema, data);
  const computedDisplayType = computeDisplayType(
    displayType.typeLabel,
    propertyName
  );
  if (computedDisplayType.multiline) {
    renderer.appendHeading(baseHeadingLevel, propertyName);
    renderer.appendParagraph(
      `\n\`\`\`\n${computedDisplayType.content}\n\`\`\``
    );
  } else {
    renderer.appendHeading(
      baseHeadingLevel,
      `${renderer.escapeText(propertyName)}: \`${computedDisplayType.content}\``,
      { escape: false }
    );
  }

  if ("description" in schema && schema.description) {
    renderer.appendParagraph(schema.description);
  }
  if ("examples" in schema && schema.examples.length > 0) {
    renderer.appendParagraph(
      `_${schema.examples.length > 1 ? "Examples" : "Example"}:_`
    );
    for (const example of schema.examples) {
      renderer.appendCode(example);
    }
  }

  if ("defaultValue" in schema && schema.defaultValue) {
    renderer.appendParagraph(`_Default Value:_ \`${schema.defaultValue}\``);
  }

  // TODO: this is a quick-n-dirty deduping of breakout types, but if there are
  // two different schemas with the same name they'll be deduped, which is wrong.
  for (let i = 0; i < displayType.breakoutSubTypes.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const breakoutSubType = displayType.breakoutSubTypes[i]!;
    if (
      displayType.breakoutSubTypes.findIndex(
        (b) => b.label === breakoutSubType.label
      ) !== i
    ) {
      continue;
    }
    renderSchema({
      renderer,
      site,
      schema: breakoutSubType.schema,
      data: data,
      baseHeadingLevel: Math.min(baseHeadingLevel + 1, MIN_HEADING_LEVEL),
      topLevelName: breakoutSubType.label,
      depth: depth + 1,
    });
  }
}

export function renderSchema({
  renderer,
  site,
  schema,
  data,
  baseHeadingLevel,
  topLevelName,
  depth,
}: RenderSchemaOptions & {
  topLevelName: string;
}) {
  const { maxTypeSignatureLineLength, maxSchemaNesting } =
    getSettings().display;

  function renderObjectProperties(
    objectValue: ObjectValue,
    { isOpenOnLoad = false }: { isOpenOnLoad?: boolean }
  ) {
    renderer.beginExpandableSection(topLevelName, {
      isOpenOnLoad,
    });
    for (const [key, value] of Object.entries(objectValue.properties)) {
      if (value.type === "chunk") {
        const schemaChunk = getSchemaFromId(value.chunkId, data);
        renderSchemaFrontmatter({
          renderer,
          site,
          schema: schemaChunk.chunkData.value,
          baseHeadingLevel,
          data,
          depth,
          propertyName: key,
        });
      } else if (value.type === "enum") {
        renderer.appendHeading(baseHeadingLevel, key);
        let computedTypeLabel = `_Type Signature:_ \`${value.values.map((v) => (typeof v === "string" ? `'${v}'` : v)).join(" | ")}\``;
        if (computedTypeLabel.length > maxTypeSignatureLineLength) {
          computedTypeLabel = `_Type Signature:_\n\`\`\`\nenum${value.values.map((v) => `\n  ${typeof v === "string" ? `'${v}'` : v}`).join("")}\n\`\`\``;
        }
        renderer.appendParagraph(computedTypeLabel);
      } else {
        renderSchemaFrontmatter({
          renderer,
          site,
          schema: value,
          baseHeadingLevel,
          data,
          depth,
          propertyName: key,
        });
      }
    }
    renderer.endExpandableSection();
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    renderSchemaFrontmatter({
      renderer,
      site,
      schema: arrayLikeValue,
      baseHeadingLevel,
      data,
      depth,
      propertyName: topLevelName,
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    renderSchemaFrontmatter({
      renderer,
      site,
      schema: unionValue,
      baseHeadingLevel,
      data,
      depth,
      propertyName: topLevelName,
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    renderSchemaFrontmatter({
      renderer,
      site,
      schema: primitiveValue,
      baseHeadingLevel,
      data,
      depth,
      propertyName: topLevelName,
    });
    if (primitiveValue.type === "enum") {
      renderer.appendParagraph(
        `Values: ${primitiveValue.values.map((v) => `\`${v}\``).join(", ")}`
      );
    }
  }

  if (depth >= maxSchemaNesting) {
    // This shouldn't be possible, since we only recurse on objects
    if (schema.type !== "object") {
      throw new Error("Schema must be an object to be embedded");
    }
    const embedName = schema.name;
    const sidebarLinkRenderer = site.createEmbedPage(embedName);

    // If no renderer was returned, that means we've already rendered this embed
    if (sidebarLinkRenderer) {
      sidebarLinkRenderer.appendHeading(baseHeadingLevel, embedName);
      if (schema.description) {
        sidebarLinkRenderer.appendParagraph(schema.description);
      }
      renderSchema({
        renderer: sidebarLinkRenderer,
        site,
        schema,
        data,
        baseHeadingLevel,
        topLevelName,
        depth: 0,
      });
      sidebarLinkRenderer.finalize();
    }
    renderer.appendSidebarLink({
      title: `${embedName} Details`,
      embedName,
    });
    return;
  }

  switch (schema.type) {
    case "object": {
      renderObjectProperties(schema, {
        isOpenOnLoad: true,
      });
      break;
    }
    case "map":
    case "set":
    case "array": {
      renderArrayLikeItems(schema);
      break;
    }
    case "union": {
      renderUnionItems(schema);
      break;
    }
    default: {
      renderBasicItems(schema);
      break;
    }
  }
}
