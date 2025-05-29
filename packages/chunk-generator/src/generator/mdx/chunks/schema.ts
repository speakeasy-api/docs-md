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
import type { Renderer } from "../renderer.ts";
import { getSchemaFromId } from "../util.ts";

// TODO: make this configurable
const MAX_DEPTH = 3;

type RenderSchemaOptions = {
  renderer: Renderer;
  schema: SchemaValue;
  data: Map<string, Chunk>;
  baseHeadingLevel: number;
  topLevelName: string;
  depth: number;
};

type TypeLabel = {
  label: string;
  children: TypeLabel[];
};

type DisplayType = {
  typeLabel: TypeLabel;
  breakoutSubTypes: Array<{ label: string; schema: SchemaValue }>;
  linkSubTypes: Array<{ label: string; link: string }>;
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
        linkSubTypes: [],
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
        (d) => d.breakoutSubTypes.length > 0 || d.linkSubTypes.length > 0
      );
      if (!hasBreakoutSubType) {
        return {
          typeLabel: {
            label: "union",
            children: displayTypes.map((d) => d.typeLabel),
          },
          breakoutSubTypes: [],
          linkSubTypes: [],
        };
      }
      const breakoutSubTypes = displayTypes.flatMap((d) => d.breakoutSubTypes);
      const linkSubTypes = displayTypes.flatMap((d) => d.linkSubTypes);
      return {
        typeLabel: {
          label: "union",
          children: displayTypes.map((d) => d.typeLabel),
        },
        breakoutSubTypes,
        linkSubTypes,
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
        linkSubTypes: [],
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
    case "any": {
      return {
        typeLabel: { label: value.type, children: [] },
        breakoutSubTypes: [],
        linkSubTypes: [],
      };
    }
    default: {
      assertNever(value);
    }
  }
}

function renderDisplayType({
  renderer,
  value,
  baseHeadingLevel,
  data,
  depth,
}: {
  renderer: Renderer;
  value: SchemaValue;
  baseHeadingLevel: number;
  data: Map<string, Chunk>;
  depth: number;
}) {
  const displayType = getDisplayType(value, data);
  let computedTypeLabel = "Signature:\n\n```\n";
  function computeTypeLabel(typeLabel: TypeLabel, indentation: number) {
    computedTypeLabel += "  ".repeat(indentation) + typeLabel.label + "\n";
    for (const child of typeLabel.children) {
      computeTypeLabel(child, indentation + 1);
    }
  }
  computeTypeLabel(displayType.typeLabel, 0);
  renderer.appendParagraph(computedTypeLabel + "```");
  if (displayType.linkSubTypes.length === 1) {
    renderer.appendParagraph(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `See [${displayType.linkSubTypes[0]!.label}](${displayType.linkSubTypes[0]!.link})`
    );
  } else if (displayType.linkSubTypes.length > 1) {
    renderer.appendParagraph("See:");
    renderer.appendList(
      displayType.linkSubTypes.map(
        (linkSubType) => `[${linkSubType.label}](${linkSubType.link})`
      )
    );
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
      schema: breakoutSubType.schema,
      data: data,
      baseHeadingLevel,
      topLevelName: breakoutSubType.label,
      depth: depth + 1,
    });
  }
}

export function renderSchema({
  renderer,
  schema,
  data,
  baseHeadingLevel,
  topLevelName,
  depth,
}: RenderSchemaOptions) {
  function renderObjectProperties(
    objectValue: ObjectValue,
    { isOpenOnLoad = false }: { isOpenOnLoad?: boolean }
  ) {
    renderer.beginExpandableSection(topLevelName, {
      isOpenOnLoad,
    });
    for (const [key, value] of Object.entries(objectValue.properties)) {
      if (value.type === "chunk") {
        renderer.appendHeading(5, key);
        const schemaChunk = getSchemaFromId(value.chunkId, data);
        renderDisplayType({
          renderer,
          value: schemaChunk.chunkData.value,
          baseHeadingLevel,
          data: data,
          depth,
        });
      } else if (value.type === "enum") {
        renderer.appendHeading(5, key);
        renderer.appendParagraph(
          `Signature:\n\`\`\`\nenum${value.values.map((v) => `\n  ${v}`).join("")}\n\`\`\``
        );
      } else {
        renderer.appendHeading(5, key);
        renderDisplayType({
          renderer,
          value,
          baseHeadingLevel,
          data: data,
          depth,
        });
      }
    }
    renderer.endExpandableSection();
  }

  function renderArrayLikeItems(
    arrayLikeValue: ArrayValue | MapValue | SetValue
  ) {
    renderDisplayType({
      renderer,
      value: arrayLikeValue,
      baseHeadingLevel,
      data: data,
      depth,
    });
  }

  function renderUnionItems(unionValue: UnionValue) {
    renderDisplayType({
      renderer,
      value: unionValue,
      baseHeadingLevel,
      data: data,
      depth,
    });
    return;
  }

  function renderBasicItems(primitiveValue: SchemaValue) {
    renderDisplayType({
      renderer,
      value: primitiveValue,
      baseHeadingLevel,
      data: data,
      depth,
    });
    if (primitiveValue.type === "enum") {
      renderer.appendParagraph(
        `Values: ${primitiveValue.values.map((v) => `\`${v}\``).join(", ")}`
      );
    }
  }

  if (depth >= MAX_DEPTH) {
    renderer.appendSidebarLink({
      title: "Nested Schema Placeholder",
      content: `# Nested Schema Placeholder

This is a placeholder for a nested schema. It will be implemented soon.`,
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
