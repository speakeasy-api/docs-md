import type { Meta, StoryObj } from "@storybook/react";

import { JsonViewer } from "./index.tsx";

const meta: Meta<typeof JsonViewer> = {
  title: "Components/JsonViewer",
  component: JsonViewer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component that displays a JSON object in a tree structure with proper bracket formatting.",
      },
    },
  },
  argTypes: {
    json: {
      control: "object",
      description: "The JSON object to display",
    },
    rootName: {
      control: "text",
      description: "Optional root name for the JSON object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    json: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    },
  },
};

export const WithRootName: Story = {
  args: {
    json: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    },
    rootName: "user",
  },
};

export const WithNestedObject: Story = {
  args: {
    json: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
      },
    },
  },
};

export const WithMultipleNestedObjects: Story = {
  args: {
    json: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        coordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
    },
  },
};

export const WithNullAndUndefinedValues: Story = {
  args: {
    json: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
      },
      spouse: null,
      middleName: undefined,
    },
  },
};
