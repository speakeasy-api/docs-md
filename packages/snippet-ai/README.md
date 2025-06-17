# Snippet-AI React

An AI-powered React component that generates code suggestions. [Learn more about Snippet-AI](https://www.speakeasy.com/docs/snippet-ai/overview)

## Features

- AI-powered code suggestions
- Command palette interface (⌘K / Ctrl+K)
- OpenAPI specification integration
- Modern, responsive design

## Integration Guide

1. Install the package via npm:

   ```sh
   npm install @speakeasy-api/snippet-ai-react
   ```

2. Implement the component:

   ```jsx
   import { SnippetAI } from '@speakeasy-api/snippet-ai-react';

   function App() {
     return (
       <div>
         <SnippetAI
           codeLang="typescript"
           publishingToken="sample_speakeasy_codewords_publishing_token"
         />
       </div>
     );
   }
   ```

3. Access the command bar using:

   - macOS: ⌘K
   - Windows/Linux: Ctrl+K

4. Optional - To open SnippetAI using a button, an onClick handler will be attached to the first element passed into the component:

   ```jsx
   import { SnippetAI } from '@speakeasy-api/snippet-ai-react';

   function App() {
     return (
       <div>
         <SnippetAI
           codeLang="typescript"
           publishingToken="sample_speakeasy_codewords_publishing_token"
         >
           <button>Ask AI</button>
         </SnippetAI>
       </div>
     );
   }
   ```

## Configuration

### Required Props

- `publishingToken`: Public access token for authentication and access to the API

### Optional Props

- `children`: This takes an optional element that will be used as a trigger to open SnippetAI. This is very similar to a popover trigger component.

- `baseUrl`: Override the default API endpoint (falls back to spec's server URL if not provided)

- `codeLang`: Set the programming language for suggestion results. One of `typescript`, `python`, `go`, `java`, `csharp`, or `php` (defaults to `typescript`).

- `toggleShortcut`: Set the keyboard shortcut that opens the Code Words Command Bar. Defaults to Command+K. Example: "$mod+k" (cmd+k / ctrl+k)

- `zIndex`: Override the default z-index of 1000. Useful if you see your content on top of the command bar

- `suggestions`: Sets a searchable list of suggestions to easily access when launching the command bar. Example: suggestions=["Create a function that gets all workspaces", "Create a function that gets a user by id"]
