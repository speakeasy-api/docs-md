/* eslint-disable fast-import/no-restricted-imports */
import type { Meta, StoryObj } from "@storybook/react";

import { CodeSample } from "../components/CodeSample/CodeSample.tsx";
import {
  Operation,
  OperationCodeSamplesSection,
  OperationDescriptionSection,
  OperationSummarySection,
  OperationTitleSection,
} from "../components/Operation/Operation.tsx";
import { SectionContent } from "../components/SectionContent/SectionContent.tsx";
import { SectionTab } from "../components/SectionTab/SectionTab.tsx";
import { SectionTitle } from "../components/SectionTitle/SectionTitle.tsx";
import { TabbedSection } from "../components/TabbedSection/TabbedSection.tsx";
import { TryItNow } from "../components/TryItNow/TryItNow.tsx";

const meta: Meta<typeof TryItNow> = {
  title: "Components/TryItNow",
  component: TryItNow,
  render: (args) => (
    <Operation>
      <OperationTitleSection slot="title">
        <h1>Mock Operation Title</h1>
      </OperationTitleSection>
      <OperationSummarySection slot="summary">
        <h2>Mock Operation Summary</h2>
      </OperationSummarySection>
      <OperationDescriptionSection slot="description">
        <p>Mock Operation Description</p>
      </OperationDescriptionSection>
      <OperationCodeSamplesSection slot="code-samples">
        <TabbedSection>
          <SectionTitle slot="title">
            <h3>TryItNow</h3>
          </SectionTitle>
          <SectionTab slot="tab" id="monaco-editor">
            TypeScript
          </SectionTab>
          <SectionContent slot="content" id="monaco-editor">
            <TryItNow {...args} />
          </SectionContent>
          <SectionTab slot="tab" id="code-samples">
            Code Samples
          </SectionTab>
          <SectionContent slot="content" id="code-samples">
            <CodeSample>
              <pre>
                <code>{args.defaultValue}</code>
              </pre>
            </CodeSample>
          </SectionContent>
        </TabbedSection>
      </OperationCodeSamplesSection>
    </Operation>
  ),
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: `// Welcome to the Try It Now editor!
console.log("Hello, world!");

const sum = (a: number, b: number) => a + b;
console.log("2 + 2 =", sum(2, 2));`,
  },
};

export const WithExternalDependencies: Story = {
  args: {
    defaultValue: `import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const user = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
};

console.log("Valid user:", userSchema.parse(user));`,
    externalDependencies: {
      zod: "^3.22.0",
    },
  },
};

export const APIExample: Story = {
  args: {
    defaultValue: `// Example API call
async function fetchUser(id: number) {
  const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  const data = await response.json();
  return data;
}

// Fetch user with ID 1
fetchUser(1).then(user => {
  console.log("User:", user);
});`,
  },
};

export const TypeScriptExample: Story = {
  args: {
    defaultValue: `interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

class UserService {
  private users: Map<number, User> = new Map();

  addUser(user: User): void {
    this.users.set(user.id, user);
    console.log(\`User \${user.name} added successfully\`);
  }

  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

const service = new UserService();
service.addUser({
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  roles: ["admin", "user"]
});

console.log("All users:", service.getAllUsers());`,
  },
};

export const EmptyEditor: Story = {
  args: {
    defaultValue: "",
  },
};

export const SimpleCalculation: Story = {
  args: {
    defaultValue: `// Simple calculator example
const calculator = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => b !== 0 ? a / b : NaN,
};

console.log("10 + 5 =", calculator.add(10, 5));
console.log("10 - 5 =", calculator.subtract(10, 5));
console.log("10 * 5 =", calculator.multiply(10, 5));
console.log("10 / 5 =", calculator.divide(10, 5));`,
  },
};
