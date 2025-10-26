import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExportNamedDeclaration } from "oxc-parser";
import { parseSync } from "oxc-parser";

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src");

/**
 * Convert a character offset to line and column numbers
 */
function offsetToLineColumn(
  source: string,
  offset: number
): { line: number; column: number } {
  let line = 1;
  let column = 1;

  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  return { line, column };
}

type BaseComponentEntry = {
  symbol: string;
  filePath: string;
};

type ExtendedComponentEntry = BaseComponentEntry & {
  componentName: string;
  // Map from event name to type name
  events: Record<string, string>;
};

function getComponentList() {
  // Read and parse the file
  const entryPoint = join(SRC_DIR, "index.ts");
  const parsedEntryPoint = parseSync(
    entryPoint,
    readFileSync(entryPoint, "utf-8"),
    {
      sourceType: "module",
    }
  );

  // Go through the list of exports and find the ones that are components
  const components = new Map<string, string>(); // Map from filepath to symbol
  for (const exportStatement of parsedEntryPoint.module.staticExports) {
    for (const exportEntry of exportStatement.entries) {
      const moduleSpecifier = exportEntry.moduleRequest?.value;

      // Make sure this is an export from the components directory and not a
      // type export
      if (!moduleSpecifier?.startsWith("./components") || exportEntry.isType) {
        continue;
      }

      // Get and validate the symbol. If we don't have a symbol, then that means
      // this was `import "foo";`
      const symbol = exportEntry.exportName.name;
      if (!symbol) {
        continue;
      }

      // Store the component info
      const componentPath = join(SRC_DIR, moduleSpecifier);
      if (components.has(componentPath)) {
        throw new Error(
          `Multiple components found for ${componentPath}: ${components.get(componentPath)} and ${symbol}`
        );
      }
      components.set(componentPath, symbol);
    }
  }

  // Convert to array and sort by filename alphabetically
  return Array.from(components.entries())
    .map(([filePath, symbol]) => ({
      filePath,
      symbol,
    }))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
}

function getComponentData(components: BaseComponentEntry[]) {
  const componentData: ExtendedComponentEntry[] = [];
  const globalEventTypes = new Set<string>();

  for (const { filePath, symbol } of components) {
    // Read in and parse the file
    const componentFileContents = readFileSync(filePath, "utf-8");
    const parsedFile = parseSync(filePath, componentFileContents, {
      sourceType: "module",
    });

    // Find the component export
    const componentExport = parsedFile.module.staticExports.find(
      (exportStatement) =>
        exportStatement.entries.some(
          (entry) => entry.exportName.name === symbol
        )
    );
    if (!componentExport) {
      throw new Error(`Could not find export for ${symbol} in ${filePath}`);
    }

    // Look up the original AST node
    let exportNode: ExportNamedDeclaration | undefined;
    for (const node of parsedFile.program.body) {
      if (node.type === "ExportNamedDeclaration") {
        if (
          node.start === componentExport.start &&
          node.end === componentExport.end
        ) {
          exportNode = node;
          break;
        }
      }
    }
    if (!exportNode) {
      throw new Error(
        `Could not find export node for ${symbol} in ${filePath}`
      );
    }
    if (exportNode.declaration?.type !== "ClassDeclaration") {
      throw new Error(
        `Export node for ${symbol} in ${filePath} is not a class declaration`
      );
    }

    // Get the customElement decorator
    const customElementDecorator = exportNode.declaration.decorators?.find(
      (decorator) =>
        decorator.type === "Decorator" &&
        decorator.expression.type === "CallExpression" &&
        decorator.expression.callee.type === "Identifier" &&
        decorator.expression.callee.name === "customElement"
    );
    if (!customElementDecorator) {
      throw new Error(
        `Could not find customElement decorator for ${symbol} in ${filePath}`
      );
    }

    // Get the component name from the first argument of the decorator
    if (customElementDecorator.expression.type !== "CallExpression") {
      throw new Error(
        `CustomElement decorator for ${symbol} in ${filePath} is not a call expression`
      );
    }
    const componentNameArgument =
      customElementDecorator.expression.arguments[0];
    if (!componentNameArgument) {
      throw new Error(
        `CustomElement decorator for ${symbol} in ${filePath} is missing an argument`
      );
    }
    if (componentNameArgument.type !== "Literal") {
      throw new Error(
        `CustomElement decorator for ${symbol} in ${filePath} is not a literal`
      );
    }
    const componentName = componentNameArgument.value;
    if (typeof componentName !== "string") {
      throw new Error(
        `CustomElement decorator for ${symbol} in ${filePath} is not a string`
      );
    }

    // Get the list of events and types
    const events: Record<string, string> = {};
    const classBody = exportNode.declaration.body.body;

    for (const member of classBody) {
      // Look for property definitions with @event decorator
      if (member.type !== "PropertyDefinition") {
        continue;
      }

      // Find @event decorator
      const eventDecorator = member.decorators?.find(
        (decorator) =>
          decorator.type === "Decorator" &&
          decorator.expression.type === "CallExpression" &&
          decorator.expression.callee.type === "Identifier" &&
          decorator.expression.callee.name === "event"
      );
      if (eventDecorator?.expression?.type !== "CallExpression") {
        continue;
      }

      // Used for error reporting
      const startLine = offsetToLineColumn(
        componentFileContents,
        eventDecorator.start
      ).line;

      // Get the event type from decorator options
      const decoratorArg = eventDecorator.expression.arguments[0];
      if (decoratorArg?.type !== "ObjectExpression") {
        const pos = offsetToLineColumn(
          componentFileContents,
          eventDecorator.start
        );
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${pos.line}:${pos.column} is not an object expression`
        );
      }

      // Get the name of the event
      let eventType: string | undefined;
      for (const prop of decoratorArg.properties) {
        if (
          prop.type === "Property" &&
          prop.key.type === "Identifier" &&
          prop.key.name === "type" &&
          prop.value.type === "Literal" &&
          typeof prop.value.value === "string"
        ) {
          eventType = prop.value.value;
          break;
        }
      }
      if (!eventType) {
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${startLine} is missing a type property`
        );
      }

      // Make sure we don't have an event name collision
      if (globalEventTypes.has(eventType)) {
        throw new Error(
          `Event "${eventType}" is declared in multiple components. Event types must be globally unique`
        );
      }
      globalEventTypes.add(eventType);

      // Get the type parameter from EventDispatcher<T>
      const typeAnnotation = member.typeAnnotation?.typeAnnotation;
      if (!typeAnnotation?.type || typeAnnotation.type !== "TSTypeReference") {
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${startLine} is not a type reference`
        );
      }
      if (
        typeAnnotation.typeName.type !== "Identifier" ||
        typeAnnotation.typeName.name !== "EventDispatcher" ||
        !typeAnnotation.typeArguments
      ) {
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${startLine} is not a type reference`
        );
      }
      const typeParam = typeAnnotation.typeArguments.params[0];
      if (!typeParam) {
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${startLine} is missing a type parameter`
        );
      }
      if (
        typeParam.type !== "TSTypeReference" ||
        typeParam.typeName?.type !== "Identifier"
      ) {
        throw new Error(
          `Event decorator for ${symbol} at ${filePath}:${startLine} is not a type reference`
        );
      }
      events[eventType] = typeParam.typeName.name;
    }

    // Store the data
    componentData.push({
      symbol,
      filePath,
      componentName,
      events,
    });
  }

  return componentData;
}

function generateAmbientDeclarations(components: ExtendedComponentEntry[]) {
  // Collect all event types to import
  const eventTypes = new Set<string>();
  for (const { events } of components) {
    for (const eventTypeName of Object.values(events)) {
      eventTypes.add(eventTypeName);
    }
  }

  const imports = components
    .map(({ filePath, symbol, events }) => {
      const relativePath = filePath.replace(SRC_DIR, "");
      const eventTypeNames = Object.values(events);
      const allImports = [symbol, ...eventTypeNames];
      return `import type { ${allImports.join(", ")} } from "..${relativePath}";`;
    })
    .join("\n");

  // Collect all events across all components
  const allEvents: { eventName: string; eventType: string }[] = [];
  for (const { events } of components) {
    for (const [eventName, eventType] of Object.entries(events)) {
      allEvents.push({ eventName, eventType });
    }
  }

  const eventMapEntries =
    allEvents.length > 0
      ? `\n\n  interface HTMLElementEventMap {\n${allEvents.map(({ eventName, eventType }) => `    "${eventName}": CustomEvent<${eventType}>;`).join("\n")}\n  }`
      : "";

  const nameMap = `declare global {
  interface HTMLElementTagNameMap {
${Array.from(components.entries())
  .map(([, { symbol, componentName }]) => {
    return `    "${componentName}": ${symbol};`;
  })
  .join("\n")}
  }${eventMapEntries}
}`;

  const reactCustomElement = `declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
${Array.from(components.entries())
  .map(([, { symbol, componentName }]) => {
    return `      "${componentName}": ReactCustomElement<${symbol}>;`;
  })
  .join("\n")}
    }
  }
}`;

  const ambientSource = `// DO NOT EDIT THIS FILE. It is auto-generated by the generate-ambient script.
/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-namespace */

${imports}
import type { ReactCustomElement } from "./components.ts";

${nameMap}

${reactCustomElement}
`;

  writeFileSync(join(SRC_DIR, "types/ambient.ts"), ambientSource);
}

generateAmbientDeclarations(getComponentData(getComponentList()));
