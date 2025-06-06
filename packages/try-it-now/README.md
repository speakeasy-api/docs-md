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
import { TryItNow } from '@speakeasy-api/try-it-now-react';

const App = () => {
  return (
    <TryItNow
      defaultValue={`console.log('Hello, World!');`}
      externalDependencies={{
        lodash: '^4.17.21',
      }}
    />
  );
};
```

## API Reference

### Props

| Prop                      | Type                                   | Default     | Description                                          |
| ------------------------- | -------------------------------------- | ----------- | ---------------------------------------------------- |
| `defaultValue`            | `string`                               | `''`        | Initial code content in the editor                   |
| `externalDependencies`    | `Dependencies`                         | `undefined` | External npm packages to include                     |
| `_enableUnsafeAutoImport` | `boolean`                              | `false`     | Enable automatic dependency detection (experimental) |
| `containerProps`          | `React.HTMLAttributes<HTMLDivElement>` | `undefined` | Props to pass to the container div                   |
| `disableContainer`        | `boolean`                              | `false`     | Disable the default container wrapper                |
| `sandpackOptions`         | `SandpackOptions`                      | `{}`        | Configuration options for Sandpack                   |
| `setupOptions`            | `SandpackSetup`                        | `{}`        | Setup configuration for the sandbox                  |

### Types

```tsx
type Dependencies = Record<string, string>;

type TryItNowProps = {
  externalDependencies?: Dependencies;
  defaultValue?: string;
  _enableUnsafeAutoImport?: boolean;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  container?: React.ReactNode;
  disableContainer?: boolean;
  sandpackOptions?: SandpackOptions;
  setupOptions?: SandpackSetup;
};
```

## Advanced Usage

### With Custom Dependencies

```tsx
<TryItNow
  defaultValue={`
import _ from 'lodash';

const numbers = [1, 2, 3, 4, 5];
const doubled = _.map(numbers, n => n * 2);
console.log('Doubled:', doubled);
  `}
  externalDependencies={{
    lodash: '^4.17.21',
    axios: '^1.0.0',
  }}
/>
```

### With Custom Styling

```tsx
<TryItNow
  defaultValue={`console.log('Styled playground');`}
  containerProps={{
    style: {
      maxWidth: '800px',
      margin: '20px auto',
      borderRadius: '12px',
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

## Styling

The component uses inline styles by default but provides a theme system for customization. The default theme includes:

- **Colors**: Primary, secondary, text, border, and background colors
- **Typography**: Inter font family with system font fallbacks
- **Layout**: Responsive flexbox layout with proper spacing
- **Shadows**: Subtle box shadows for depth

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

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## License

UNLICENSED

---

Built with ❤️ by the Speakeasy team
