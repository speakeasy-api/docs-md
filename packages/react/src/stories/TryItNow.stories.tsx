/* eslint-disable fast-import/no-restricted-imports */
import type { Meta } from "@storybook/react";

import { CodeSample } from "../components/CodeSample/CodeSample.tsx";
import {
  Operation,
  OperationCodeSamplesSection,
  OperationDescriptionSection,
  OperationSummarySection,
  OperationTitleSection,
} from "../components/Operation/Operation.tsx";
import { ResponseTab } from "../components/ResponseTabbedSection/ResponseTab.tsx";
import { ResponseTabbedSection } from "../components/ResponseTabbedSection/ResponseTabbedSection.tsx";
import { SectionContent } from "../components/SectionContent/SectionContent.tsx";
import { SectionTitle } from "../components/SectionTitle/SectionTitle.tsx";
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
        <ResponseTabbedSection>
          <SectionTitle slot="title">
            <h3>TryItNow</h3>
          </SectionTitle>
          <ResponseTab slot="tab" id="monaco-editor" tags={{}}>
            TypeScript
          </ResponseTab>
          <SectionContent slot="content" id="monaco-editor">
            <TryItNow {...args} />
          </SectionContent>
          <ResponseTab slot="tab" id="code-samples" tags={{}}>
            Code Samples
          </ResponseTab>
          <SectionContent slot="content" id="code-samples">
            <CodeSample>
              <pre>
                <code>{args.defaultValue}</code>
              </pre>
            </CodeSample>
          </SectionContent>
        </ResponseTabbedSection>
      </OperationCodeSamplesSection>
    </Operation>
  ),
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  args: {
    language: "typescript",
    defaultValue: `// Welcome to the Try It Now editor!
console.log("Hello, world!");

const sum = (a: number, b: number) => a + b;
console.log("2 + 2 =", sum(2, 2));`,
  },
};

export const APIExample = {
  args: {
    language: "typescript",
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

export const TypeScriptExample = {
  args: {
    language: "typescript",
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

export const EmptyEditor = {
  args: {
    language: "typescript",
    defaultValue: "",
  },
};

export const SimpleCalculation = {
  args: {
    language: "typescript",
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
