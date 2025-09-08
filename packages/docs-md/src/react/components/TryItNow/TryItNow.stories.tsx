import type { Meta, StoryObj } from "@storybook/react";

import { TryItNow } from "./TryItNow.tsx";
import type { TryItNowProps } from "./types.ts";

const meta: Meta<Required<TryItNowProps>> = {
  title: "Components/TryItNow",
  component: TryItNow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A code playground component that allows users to write, edit, and execute TypeScript code with external dependencies.",
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Starting value of the code editor",
    },
    externalDependencies: {
      control: "object",
      description: "External npm dependencies required by the code snippet",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {
  args: {
    defaultValue: `// Welcome to the TryItNow playground!
// Write your TypeScript code here

const greeting = "Hello, World!";
console.log(greeting);

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`,
  },
};

export const WithExternalDependencies: Story = {
  args: {
    defaultValue: `// Using external dependencies
import { z } from 'zod';

// Define a schema
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0),
});

// Create a user object
const user = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
};

// Validate the user
try {
  const validatedUser = UserSchema.parse(user);
  console.log("Valid user:", validatedUser);
} catch (error) {
  console.error("Validation error:", error);
}`,
    externalDependencies: {
      zod: "^3.25.56",
    },
  },
};

export const ConsoleOutputWithDifferentDataTypes: Story = {
  args: {
    defaultValue: `// Console output with different data types
// This story stress tests the console output with various JavaScript data types

// Primitive types
console.log("=== PRIMITIVE TYPES ===");
console.log("String:", "Hello World");
console.log("Number:", 42);
console.log("Boolean:", true);
console.log("Undefined:", undefined);
console.log("Null:", null);

// Symbol
console.log("=== SYMBOLS ===");
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol.for("global");
console.log("Symbol():", sym1);
console.log("Symbol('description'):", sym2);
console.log("Symbol.for('global'):", sym3);

// Objects
console.log("=== OBJECTS ===");
const simpleObj = { name: "John", age: 30 };
const nestedObj = {
  user: {
    name: "Jane",
    address: {
      street: "123 Main St",
      city: "Anytown"
    }
  },
  preferences: ["dark-mode", "notifications"]
};
const objWithMethods = {
  name: "Calculator",
  add: (a: number, b: number) => a + b,
  subtract: function(a: number, b: number) { return a - b; }
};

console.log("Simple object:", simpleObj);
console.log("Nested object:", nestedObj);
console.log("Object with methods:", objWithMethods);

// Arrays
console.log("=== ARRAYS ===");
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, null, undefined, { key: "value" }];
const nested = [[1, 2], [3, 4], [5, 6]];
const sparse = new Array(5);
sparse[0] = "first";
sparse[4] = "last";

console.log("Number array:", numbers);
console.log("Mixed array:", mixed);
console.log("Nested array:", nested);
console.log("Sparse array:", sparse);

// Maps
console.log("=== MAPS ===");
const map = new Map();
map.set("string", "value");
map.set(1, "number key");
map.set(true, "boolean key");
map.set(objWithMethods, "object key");

const mapWithComplexKeys = new Map([
  [{ id: 1 }, "object key 1"],
  [{ id: 2 }, "object key 2"],
  [[1, 2, 3], "array key"]
]);

console.log("Simple Map:", map);
console.log("Map with complex keys:", mapWithComplexKeys);

// Sets
console.log("=== SETS ===");
const set = new Set([1, 2, 3, 3, 4, 4, 5]);
const mixedSet = new Set([1, "two", true, { name: "object" }, [1, 2, 3]]);
const setWithDuplicateObjects = new Set([
  { id: 1 }, 
  { id: 1 }, // Different object reference
  { id: 2 }
]);

console.log("Number Set:", set);
console.log("Mixed Set:", mixedSet);
console.log("Set with objects:", setWithDuplicateObjects);

// Functions
console.log("=== FUNCTIONS ===");
function regularFunction() { return "regular"; }
const arrowFunction = () => "arrow";
const asyncFunction = async () => "async";
const generatorFunction = function* () { yield 1; yield 2; };

console.log("Regular function:", regularFunction);
console.log("Arrow function:", arrowFunction);
console.log("Async function:", asyncFunction);
console.log("Generator function:", generatorFunction);

// Dates
console.log("=== DATES ===");
const now = new Date();
const specificDate = new Date("2024-01-01T12:00:00Z");
const invalidDate = new Date("invalid");

console.log("Current date:", now);
console.log("Specific date:", specificDate);
console.log("Invalid date:", invalidDate);

// Regular Expressions
console.log("=== REGULAR EXPRESSIONS ===");
const regex1 = /hello/gi;
const regex2 = new RegExp("world", "i");

console.log("Regex literal:", regex1);
console.log("Regex constructor:", regex2);

// Error objects
console.log("=== ERRORS ===");
const error = new Error("Test error");
const typeError = new TypeError("Type error example");
const customError = { name: "CustomError", message: "Custom error message" };

console.log("Error object:", error);
console.log("TypeError:", typeError);
console.log("Custom error:", customError);

// Circular references
console.log("=== CIRCULAR REFERENCES ===");
const circular: any = { name: "circular" };
circular.self = circular;

const circularArray: any[] = [1, 2, 3];
circularArray.push(circularArray);

console.log("Circular object:", circular);
console.log("Circular array:", circularArray);

// WeakMap and WeakSet (these might not display much)
console.log("=== WEAK COLLECTIONS ===");
const weakMap = new WeakMap();
const weakSet = new WeakSet();
const objForWeak = { key: "weak" };

weakMap.set(objForWeak, "weak map value");
weakSet.add(objForWeak);

console.log("WeakMap:", weakMap);
console.log("WeakSet:", weakSet);

// Typed Arrays
console.log("=== TYPED ARRAYS ===");
const int8Array = new Int8Array([1, 2, 3, 4]);
const float32Array = new Float32Array([1.1, 2.2, 3.3]);
const uint8Array = new Uint8Array([255, 254, 253]);

console.log("Int8Array:", int8Array);
console.log("Float32Array:", float32Array);
console.log("Uint8Array:", uint8Array);

// ArrayBuffer
console.log("=== ARRAY BUFFER ===");
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);
view.setInt32(0, 42);

console.log("ArrayBuffer:", buffer);
console.log("DataView:", view);

console.log("=== TESTING COMPLETE ===");
console.log("All data types have been logged for console output testing!");`,
  },
};

export const PokemonAPIFetch: Story = {
  args: {
    defaultValue: `// Fetch Pokemon data from the Pokemon API
// This demonstrates working with nested objects and API responses

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
}

async function fetchPokemon(pokemonName: string): Promise<Pokemon> {
  try {
    const response = await fetch(\`https://pokeapi.co/api/v2/pokemon/\${pokemonName.toLowerCase()}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const pokemon: Pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    throw error;
  }
}

// Fetch and display Pokemon data
fetchPokemon("pikachu")
  .then(pokemon => {
    console.log(pokemon);
  })
  .catch(error => {
    console.error("Failed to fetch Pokemon:", error.message);
  });

// Try other Pokemon by changing the name:
// fetchPokemon("charizard").then(pokemon => console.log(pokemon));
// fetchPokemon("blastoise").then(pokemon => console.log(pokemon));`,
  },
};

export const SimpleExample: Story = {
  args: {
    defaultValue: `// Simple calculation example
const calculateArea = (radius: number): number => {
  return Math.PI * radius * radius;
};

const radius = 5;
const area = calculateArea(radius);

console.log(\`Circle with radius \${radius} has area: \${area.toFixed(2)}\`);`,
  },
};

export const ArrayOperations: Story = {
  args: {
    defaultValue: `// Array operations showcase
const fruits = ["apple", "banana", "cherry", "date"];

// Filter fruits with more than 5 characters
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("Long fruits:", longFruits);

// Transform to uppercase
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("Upper fruits:", upperFruits);

// Find a specific fruit
const foundFruit = fruits.find(fruit => fruit.startsWith("c"));
console.log("Found fruit starting with 'c':", foundFruit);

// Reduce to create a sentence
const sentence = fruits.reduce((acc, fruit, index) => {
  if (index === 0) return fruit;
  if (index === fruits.length - 1) return acc + " and " + fruit;
  return acc + ", " + fruit;
}, "");
console.log("Sentence:", sentence);`,
  },
};

export const Empty: Story = {
  args: {
    defaultValue: "",
  },
};
