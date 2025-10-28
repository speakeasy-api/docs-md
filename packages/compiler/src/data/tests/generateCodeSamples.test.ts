import type { SchemaValue } from "@speakeasy-api/docs-md-shared";
import { describe, expect, it } from "vitest";

import { getSchemaUnionValue } from "../unionExampleStrategies.ts";

// Helper functions to create valid SchemaValue objects
function createStringValue(): SchemaValue {
  return {
    type: "string",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
    minLength: null,
    maxLength: null,
    pattern: null,
  };
}

function createNumberValue(): SchemaValue {
  return {
    type: "number",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
    minimum: null,
    maximum: null,
  };
}

function createBooleanValue(): SchemaValue {
  return {
    type: "boolean",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
  };
}

function createNullValue(): SchemaValue {
  return {
    type: "null",
    description: "",
    examples: [],
    isNullable: true,
    defaultValue: null,
  };
}

function createObjectValue(): SchemaValue {
  return {
    type: "object",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
    properties: {},
    required: [],
    name: "TestObject",
  };
}

function createArrayValue(items: SchemaValue): SchemaValue {
  return {
    type: "array",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
    items,
    minItems: null,
    maxItems: null,
  };
}

function createMapValue(items: SchemaValue): SchemaValue {
  return {
    type: "map",
    description: "",
    examples: [],
    isNullable: false,
    defaultValue: null,
    items,
  };
}

describe("getSchemaUnionValue", () => {
  describe("minimal strategy", () => {
    it("should prefer null when present", () => {
      const union: SchemaValue[] = [
        createStringValue(),
        createNumberValue(),
        createNullValue(),
        createObjectValue(),
      ];
      const result = getSchemaUnionValue(union, "minimal");
      expect(result?.type).toBe("null");
    });

    it("should prefer primitive when null not present", () => {
      const union: SchemaValue[] = [createObjectValue(), createStringValue()];
      const result = getSchemaUnionValue(union, "minimal");
      expect(result?.type).toBe("string");
    });

    it("should prefer first primitive among multiple", () => {
      const union: SchemaValue[] = [
        createObjectValue(),
        createNumberValue(),
        createStringValue(),
      ];
      const result = getSchemaUnionValue(union, "minimal");
      expect(result?.type).toBe("number");
    });

    it("should prefer object when no null or primitives", () => {
      const union: SchemaValue[] = [
        createArrayValue(createStringValue()),
        createObjectValue(),
      ];
      const result = getSchemaUnionValue(union, "minimal");
      expect(result?.type).toBe("object");
    });

    it("should pick first entry when only complex types exist", () => {
      const union: SchemaValue[] = [
        createArrayValue(createStringValue()),
        createMapValue(createStringValue()),
      ];
      const result = getSchemaUnionValue(union, "minimal");
      expect(result?.type).toBe("array");
    });
  });

  describe("simple strategy", () => {
    it("should deprioritize null (pick primitive first)", () => {
      const union: SchemaValue[] = [
        createNullValue(),
        createStringValue(),
        createObjectValue(),
      ];
      const result = getSchemaUnionValue(union, "simple");
      expect(result?.type).toBe("string");
    });

    it("should pick object over null when no primitives", () => {
      const union: SchemaValue[] = [
        createNullValue(),
        createObjectValue(),
        createArrayValue(createStringValue()),
      ];
      const result = getSchemaUnionValue(union, "simple");
      expect(result?.type).toBe("object");
    });

    it("should only pick null as last resort", () => {
      const union: SchemaValue[] = [createNullValue()];
      const result = getSchemaUnionValue(union, "simple");
      expect(result?.type).toBe("null");
    });

    it("should handle union without null same as minimal", () => {
      const union: SchemaValue[] = [
        createStringValue(),
        createObjectValue(),
        createNumberValue(),
      ];
      const result = getSchemaUnionValue(union, "simple");
      expect(result?.type).toBe("string");
    });
  });

  describe("maximal strategy", () => {
    it("should prefer complex types over primitives", () => {
      const union: SchemaValue[] = [
        createStringValue(),
        createNullValue(),
        createObjectValue(),
      ];
      const result = getSchemaUnionValue(union, "maximal");
      expect(result?.type).toBe("object");
    });

    it("should prefer complex non-object types first", () => {
      const union: SchemaValue[] = [
        createStringValue(),
        createArrayValue(createStringValue()),
        createObjectValue(),
        createNullValue(),
      ];
      const result = getSchemaUnionValue(union, "maximal");
      expect(result?.type).toBe("array");
    });

    it("should prefer object over primitive", () => {
      const union: SchemaValue[] = [
        createStringValue(),
        createNumberValue(),
        createObjectValue(),
      ];
      const result = getSchemaUnionValue(union, "maximal");
      expect(result?.type).toBe("object");
    });

    it("should prefer primitive over null", () => {
      const union: SchemaValue[] = [
        createNullValue(),
        createStringValue(),
        createBooleanValue(),
      ];
      const result = getSchemaUnionValue(union, "maximal");
      expect(result?.type).toBe("string");
    });

    it("should only pick null when nothing else available", () => {
      const union: SchemaValue[] = [createNullValue()];
      const result = getSchemaUnionValue(union, "maximal");
      expect(result?.type).toBe("null");
    });
  });
});
