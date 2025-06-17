import type { Meta, StoryObj } from '@storybook/react';
import { SnippetAI } from '../index';

const meta = {
  title: 'CommandBar',
  component: SnippetAI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  argTypes: {
    theme: {
      control: 'object',
      options: [{ theme: 'light' }, { theme: 'dark' }],
    },
    // Include one choice that is not a language
    codeLang: {
      control: 'select',
      options: ['typescript', 'python', 'go', 'javascropt'],
    },
  },
  decorators: [
    (Story) => {
      return (
        <>
          <p>Open using CMD+J or SUPER+J</p>
          <Story />
        </>
      );
    },
  ],
  args: {},
} satisfies Meta<typeof SnippetAI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    codeLang: 'typescript',
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    theme: { theme: 'light' },
    baseUrl: 'http://localhost:3000/api',
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};

export const WithSuggestions: Story = {
  args: {
    codeLang: 'typescript',
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    theme: { theme: 'light' },
    baseUrl: 'http://localhost:3000/api',
    suggestions: [
      'Create a function to get all users by ID',
      'Create a function to get all workspaces in the project',
    ],
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};

export const WithLanguageSelect: Story = {
  args: {
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    theme: { theme: 'light' },
    suggestions: [
      'Create a function to get all users by ID',
      'Create a function to get all workspaces in the project',
    ],
    baseUrl: 'http://localhost:3000/api',
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};

export const WithAToggleButton: Story = {
  args: {
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    children: [<button key="toggle-button">Toggle SnippetAI</button>],
    theme: { theme: 'light' },
    suggestions: [
      'Create a function to get all users by ID',
      'Create a function to get all workspaces in the project',
    ],
    baseUrl: 'http://localhost:3000/api',
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};

export const WithBadLanguage: Story = {
  args: {
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    theme: { theme: 'light' },
    codeLang: 'python',
    suggestions: [
      'Create a function to get all users by ID',
      'Create a function to get all workspaces in the project',
    ],
    baseUrl: 'http://localhost:3000/api',
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};

export const WithProductionBackend: Story = {
  args: {
    toggleShortcut: '$mod+j',
    publishingToken: 'super-secret-token',
    theme: { theme: 'light' },
    codeLang: 'typescript',
    suggestions: [
      'Create a function to get all users by ID',
      'Create a function to get all workspaces in the project',
    ],
    _specSrc:
      'http://spec.speakeasy.com/vercel/vercel-docs/vercel-oas-with-code-samples',
  },
};
