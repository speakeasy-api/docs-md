# DocsMD

> **⚠️ PROJECT SUNSET NOTICE**
> 
> This project has been sunset and will not receive any additional development, maintenance, or support. It is provided as-is under the Elastic License 2.0 and may be extended or inherited according to the license constraints. Users are encouraged to fork and continue development if needed.

## What is DocsMD?

DocsMD is a powerful documentation compiler that transforms OpenAPI specifications into interactive API documentation for popular documentation frameworks. It bridges the gap between your API specification and production-ready documentation sites with minimal configuration.

**Key Features:**

- **Framework Support**: Generate documentation for Docusaurus, Nextra, or create custom renderers for any framework
- **Interactive Code Samples**: Automatically generate code examples in multiple languages (TypeScript, Python, cURL)
- **Try It Now**: Enable browser-based API testing with live code execution for TypeScript and Python SDKs
- **Rich Component Library**: Pre-built React components for displaying API operations, schemas, parameters, and responses
- **Type-Safe**: Full TypeScript support with generated type definitions
- **Customizable**: Override default components and styling to match your brand
- **MDX & Markdown**: Flexible rendering to MDX for React-based frameworks or pure Markdown for LLMs

## Why DocsMD?

Traditional API documentation tools often require significant manual effort to maintain or produce generic, static output. DocsMD solves this by:

1. **Automation**: Generate comprehensive documentation directly from your OpenAPI spec
2. **Consistency**: Ensure your documentation always matches your API specification
3. **Developer Experience**: Provide interactive code samples and live API testing
4. **Flexibility**: Works with modern documentation frameworks or custom solutions
5. **Extensibility**: Override and customize every aspect of the generated documentation

## Monorepo Structure

DocsMD is organized as a monorepo with four main packages:

### 📦 `@speakeasy-api/docs-md` (Compiler)

The core compiler package that orchestrates the documentation generation process.

**Purpose**: Parses OpenAPI specifications and generates framework-specific documentation files.

**Key Exports**:
- CLI tool (`docs-md`) for generating documentation
- `generatePages()` - Programmatic API for generation
- `FrameworkConfig` - Type definitions for custom renderers
- `Settings` - Configuration schema

**Location**: `packages/compiler/`

### ⚛️ `@speakeasy-api/docs-md-react` (React Components)

React component library used in the generated MDX documentation.

**Purpose**: Provides rich, interactive UI components for displaying API documentation.

**Key Components**:
- `Operation` - Displays API operations with method, path, and details
- `CodeSample` - Syntax-highlighted code examples
- `TryItNow` - Interactive API testing interface
- `ExpandableSection` - Collapsible sections for schemas and parameters
- `ResponseTabbedSection` - Multi-response display with tabs
- `Pill` - Badges for methods, types, and status codes

**Location**: `packages/react/`

### 🔧 `@speakeasy-api/docs-md-shared` (Shared)

Shared utilities, types, and runtime code used across packages.

**Purpose**: Common code and type definitions to avoid duplication.

**Key Exports**:
- TypeScript and Python runtime for Try It Now feature
- cURL parser and runtime
- Type definitions for chunks, logging, and configuration
- ESLint and Prettier configurations

**Location**: `packages/shared/`

### 🌐 `@speakeasy-api/docs-md-components` (Web Components)

Web Components implementation (Lit-based) for framework-agnostic usage.

**Purpose**: Provide framework-independent components using Web Components standard.

**Key Exports**:
- `<pill-component>` - Web component version of Pill
- CSS files for Docusaurus and Nextra themes

**Location**: `packages/web-components/`

## Compiler Architecture

### Renderer Types

DocsMD supports multiple renderer types to accommodate different output formats:

#### 1. **MDX Renderer** (`rendererType: "mdx"`)

Generates MDX (Markdown + JSX) files for React-based documentation frameworks.

**Use Cases**:
- Docusaurus sites
- Nextra (Next.js) documentation
- Custom React-based documentation platforms

**Features**:
- Embeds React components directly in markdown
- Supports interactive features like Try It Now
- Type-safe component props
- CSS styling integration

**Configuration**:
```typescript
{
  rendererType: "mdx",
  componentPackageName: "@speakeasy-api/docs-md-react",
  stringAttributeEscapeStyle: "html" | "react-value"
}
```

#### 2. **Markdown Renderer** (`rendererType: "markdown"`)

Generates pure Markdown output without embedded components.

**Use Cases**:
- LLM training data
- Documentation that needs to be portable
- Static site generators without React support
- Plain text documentation needs

**Features**:
- Clean, readable Markdown
- No framework dependencies
- Maximum portability
- SEO-friendly content

### Core Rendering Process

The compiler follows this high-level flow:

1. **Parse OpenAPI Spec**: Load and validate the OpenAPI specification
2. **Generate Data Structures**: Convert OpenAPI into internal "chunks" (operations, schemas, tags, etc.)
3. **Prepare Code Samples**: Generate code examples for configured languages
4. **Render Pages**: Use the appropriate renderer (MDX or Markdown) to create documentation files
5. **Post-Process**: Apply framework-specific transformations and optimizations
6. **Write Output**: Save generated files to the configured output directory

### Page Generation

Pages are generated for:

- **Tags**: Groups of related operations
- **Operations**: Individual API endpoints
- **Schemas**: Data models and object definitions
- **Global Security**: Authentication/authorization documentation
- **About**: API overview and information

### Extensibility

Create custom renderers by implementing the `FrameworkConfig` interface:

```typescript
import type { FrameworkConfig } from '@speakeasy-api/docs-md';

const customConfig: FrameworkConfig = {
  rendererType: "mdx",
  componentPackageName: "my-custom-components",
  stringAttributeEscapeStyle: "react-value",
  buildPagePath: (slug, options) => {
    // Custom path generation logic
  },
  buildPagePreamble: (frontMatter) => {
    // Custom front matter generation
  },
  postProcess: (pageMetadata) => {
    // Custom post-processing
  }
};
```

## Usage Guide

### Installation

Install the DocsMD CLI as a dev dependency in your documentation project:

```bash
# Using npm
npm install --save-dev @speakeasy-api/docs-md

# Using yarn
yarn add -D @speakeasy-api/docs-md

# Using pnpm
pnpm add -D @speakeasy-api/docs-md
```

### Basic Configuration

Create a `speakeasy.config.mjs` (or `.js`, `.ts`, etc.) file in your project root:

```javascript
export default {
  // Path to your OpenAPI specification
  spec: "./openapi.yaml",
  
  output: {
    // Where to generate documentation files
    pageOutDir: "./docs/api",
    
    // Framework: "docusaurus", "nextra", or custom config
    framework: "docusaurus",
  },
};
```

### Running the Compiler

```bash
# Using the CLI directly
npx docs-md

# With options
npx docs-md --clean --verbose

# Using package.json scripts (recommended)
npm run build-api-docs
```

Add to your `package.json`:

```json
{
  "scripts": {
    "build-api-docs": "docs-md --clean"
  }
}
```

### CLI Options

```
Usage: docs-md [options]

Options:
  --help, -h     Show this help message
  --config, -c   Path to config file
  --spec, -s     Path to OpenAPI spec file
  --clean, -C    Clean the output directories before generating
  --verbose, -v  Show debug output
```

### Advanced Configuration

#### Code Samples with Multiple Languages

```javascript
export default {
  spec: "./openapi.yaml",
  output: {
    pageOutDir: "./docs/api",
    framework: "docusaurus",
  },
  codeSamples: [
    {
      language: "curl",
      tryItNow: true, // Enable Try It Now for cURL
    },
    {
      language: "typescript",
      sdkTarballPath: "./sdks/typescript-sdk.tar.gz",
      tryItNow: {
        outDir: "./public/try-it-now/ts",
        urlPrefix: "/try-it-now/ts",
      },
    },
    {
      language: "python",
      sdkFolder: "../python-sdk",
      tryItNow: {
        outDir: "./public/try-it-now/python",
        urlPrefix: "/try-it-now/python",
      },
    },
  ],
};
```

#### Custom Display Options

```javascript
export default {
  spec: "./openapi.yaml",
  output: {
    pageOutDir: "./docs/api",
    framework: "nextra",
    embedOutDir: "./docs/embeds", // For nested schemas
  },
  display: {
    maxNestingLevel: 3, // Maximum depth for inline schemas
  },
};
```

#### Using Spec Data Instead of File

```javascript
import { readFileSync } from 'fs';

export default {
  specData: readFileSync('./openapi.yaml', 'utf-8'),
  output: {
    pageOutDir: "./docs/api",
    framework: "docusaurus",
  },
};
```

### Overriding React Components

DocsMD components can be customized, but the approach differs from typical React applications because the generated MDX files import components directly by name.

#### Understanding Component Imports

Generated MDX files include imports like this:

```typescript
import {
  Operation,
  CodeSample,
  TryItNow,
  ExpandableSection
} from "@speakeasy-api/docs-md-react";
```

Because components are imported directly by name in each generated file, standard MDX provider overrides **will not work**.

Create your own component package that re-exports modified versions:

**Step 1**: Create `my-custom-docs-components` package:

```typescript
// my-custom-docs-components/src/index.ts

// Re-export all default components
export * from '@speakeasy-api/docs-md-react';

// Override specific components
export { CustomCodeSample as CodeSample } from './CustomCodeSample';
export { CustomOperation as Operation } from './CustomOperation';
```

**Step 2**: Use custom package in config:

```javascript
// speakeasy.config.mjs
export default {
  spec: "./openapi.yaml",
  output: {
    pageOutDir: "./docs/api",
    framework: {
      rendererType: "mdx",
      componentPackageName: "my-custom-docs-components", // Your package
      stringAttributeEscapeStyle: "react-value",
      buildPagePath: (slug) => `${slug}.mdx`,
      buildPagePreamble: (frontMatter) => `---\n${JSON.stringify(frontMatter)}\n---`,
    },
  },
};
```

#### Styling Customization

DocsMD uses CSS custom properties (variables) for theming:

```css
/* custom.css */
:root {
  /* Override Speakeasy CSS variables */
  --speakeasy-border-color: #e0e0e0;
  --speakeasy-code-background-color: #1e1e1e;
  --speakeasy-anchor-color: #0066cc;
  --speakeasy-pill-primary-background-color: #0066cc;
  
  /* Add your custom variables */
  --my-custom-spacing: 1.5rem;
}
```

For a complete list of available CSS variables, see:
- `packages/web-components/src/docusaurus.css`
- `packages/web-components/src/nextra.css`

#### Component Architecture

DocsMD components follow a "slots" pattern for flexibility:

```tsx
<ResponseTabbedSection>
  <SectionTitle slot="title">
    ### Responses
  </SectionTitle>
  
  <SectionTab slot="tab" id="200">
    200 OK
  </SectionTab>
  
  <SectionContent slot="section" id="200">
    Success response content
  </SectionContent>
</ResponseTabbedSection>
```

This allows content to be authored in Markdown while maintaining structure.

## License

This project is licensed under the **Elastic License 2.0**. See the [LICENSE](./LICENSE) file for full terms.

## Contributing

As this project is sunset, we are not actively accepting contributions. However, you are welcome to fork the repository and continue development independently according to the license terms.

## Support

This project is provided as-is without warranty or support. For historical documentation or questions, please refer to the codebase and existing documentation.
