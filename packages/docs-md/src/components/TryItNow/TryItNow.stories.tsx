import type { Meta, StoryObj } from '@storybook/react';

import { TryItNow } from './index.tsx';

const meta: Meta<typeof TryItNow> = {
  title: 'Components/TryItNow',
  component: TryItNow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A code playground component that allows users to write, edit, and execute TypeScript code with external dependencies.',
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Starting value of the code editor',
    },
    externalDependencies: {
      control: 'object',
      description: 'External npm dependencies required by the code snippet',
    },
    _enableUnsafeAutoImport: {
      control: 'boolean',
      description: 'Experimental: Automatically scan for external dependencies from npm as user adds imports',
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

export const WithAutoImport: Story = {
  args: {
    defaultValue: `// Try importing external packages automatically
// This is experimental - import statements will be detected

const example = "Auto-import functionality";
console.log(example);

// Try adding: import { format } from 'date-fns';
// The system should automatically detect and install the dependency`,
    _enableUnsafeAutoImport: true,
  },
};

export const Empty: Story = {
  args: {
    defaultValue: "",
  },
}; 