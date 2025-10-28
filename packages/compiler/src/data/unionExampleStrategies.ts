import type { SchemaValue } from "@speakeasy-api/docs-md-shared";

import { assertNever } from "../util/assertNever.ts";
import { InternalError } from "../util/internalError.ts";

const PRIMITIVE_TYPES = new Set<SchemaValue["type"]>([
  "string",
  "number",
  "boolean",
  "bigint",
  "date",
  "date-time",
  "integer",
  "int32",
  "float32",
  "decimal",
  "binary",
]);

const COMPLEX_TYPES = new Set<SchemaValue["type"]>([
  "array",
  "map",
  "set",
  "union",
  "chunk",
  "enum",
  "jsonl",
  "event-stream",
]);

export type ExampleContext = {
  type: "request" | "response";
  strategy: "minimal" | "simple" | "maximal";
};

/**
 * Determines the next strategy to use based on the current context and type.
 *
 * For request bodies:
 * - Start with "simple" strategy at the top level
 * - Switch to "minimal" after hitting object/primitive/null
 *
 * For response bodies:
 * - Start with "maximal" strategy at the top level
 * - Switch to "simple" after hitting an object boundary
 */
function determineNextStrategy(
  context: ExampleContext,
  currentType: SchemaValue["type"]
): "minimal" | "simple" | "maximal" {
  if (context.type === "request") {
    // Request: start simple, switch to minimal after hitting object/primitive/null
    if (
      context.strategy === "simple" &&
      (currentType === "object" ||
        currentType === "null" ||
        PRIMITIVE_TYPES.has(currentType))
    ) {
      return "minimal";
    }
    return context.strategy;
  } else {
    // Response: start maximal, switch to simple after hitting object boundary
    if (context.strategy === "maximal") {
      return currentType === "object" ? "simple" : "maximal";
    }
    return "simple";
  }
}

/**
 * Creates a child context with the appropriate strategy for the given type.
 */
export function createChildContext(
  context: ExampleContext,
  currentType: SchemaValue["type"]
): ExampleContext {
  return {
    type: context.type,
    strategy: determineNextStrategy(context, currentType),
  };
}

/**
 * Selects a value from a union based on the display strategy.
 *
 * Strategies:
 * - minimal: Prioritizes null → primitives → objects → complex types
 * - simple: Prioritizes primitives → objects → complex types → null
 * - maximal: Prioritizes complex types → objects → primitives → null
 *
 * @param values Array of possible union values
 * @param displayStrategy Strategy to use for selection
 * @returns The selected schema value
 */
export function getSchemaUnionValue(
  values: SchemaValue[],
  displayStrategy: "minimal" | "simple" | "maximal"
) {
  if (!values.length) throw new InternalError("Union has no values");

  const hasNull = values.some((v) => v.type === "null");
  const primitives = values.filter((v) => PRIMITIVE_TYPES.has(v.type));
  const objects = values.filter((v) => v.type === "object");
  const complex = values.filter((v) => COMPLEX_TYPES.has(v.type));

  switch (displayStrategy) {
    case "minimal":
      if (hasNull) return values.find((v) => v.type === "null");
      if (primitives.length) return primitives[0];
      if (objects.length) return objects[0];
      return values[0];

    case "simple":
      if (primitives.length) return primitives[0];
      if (objects.length) return objects[0];
      if (complex.length) return complex[0];
      if (hasNull) return values.find((v) => v.type === "null");
      return values[0];

    case "maximal":
      // Reverse of minimal
      if (complex.length) return complex[0];
      if (objects.length) return objects[0];
      if (primitives.length) return primitives[0];
      if (hasNull) return values.find((v) => v.type === "null");
      return values[0];

    default:
      assertNever(displayStrategy);
  }
}
