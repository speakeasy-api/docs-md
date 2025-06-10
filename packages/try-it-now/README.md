# TryItNow React Component

A React component that provides an interactive code playground using Sandpack, allowing users to write, edit, and execute TypeScript code with dependency management.

## Features

- **Interactive Code Editor** - Built on top of Sandpack with syntax highlighting
- **Real Execution** - Code runs with console output
- **Customizable Styling** - Flexible props and layout options
- **Responsive Design** - Works seamlessly across different screen sizes

## Installation

```bash
npm install @speakeasy-api/try-it-now-react
```

## Basic Usage

```tsx
import { TryItNow } from "@speakeasy-api/try-it-now-react";

const App = () => {
  return (
    <TryItNow
      defaultValue={`console.log('Hello, World!');`}
      externalDependencies={{
        lodash: "^4.17.21",
      }}
    />
  );
};
```

## Advanced Usage

### With External Dependencies

```tsx
<TryItNow
  defaultValue={`
import _ from 'lodash';

const numbers = [1, 2, 3, 4, 5];
const doubled = _.map(numbers, n => n * 2);
console.log('Doubled:', doubled);
  `}
  externalDependencies={{
    lodash: "^4.17.21",
    axios: "^1.0.0",
  }}
/>
```

### With Custom Styling

```tsx
<TryItNow
  defaultValue={`console.log('Styled playground');`}
  containerProps={{
    style: {
      maxWidth: "800px",
      margin: "20px auto",
      borderRadius: "12px",
    },
  }}
/>
```

### Auto-Import Mode (Experimental)

```tsx
<TryItNow
  defaultValue={`
// Dependencies will be auto-detected and installed
import { format } from 'date-fns';
console.log(format(new Date(), 'yyyy-MM-dd'));
  `}
  _enableUnsafeAutoImport={true}
/>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check
```

## License

UNLICENSED

---
