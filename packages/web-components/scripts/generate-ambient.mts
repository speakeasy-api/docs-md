import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { parseSync } from "oxc-parser";
import { format } from "prettier";

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src");

function convertIndexToLoc(source: string, offset: number) {
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

type ComponentEntry = {
  exportName: string;
  filePath: string;
  componentName: string;
  // Map from event name to type name, e.g. "click" -> "ClickEvent"
  events: Record<string, string>;
};

function getComponentDetailsForFile({
  filePath,
  fileContents,
}: {
  filePath: string;
  fileContents: string;
}): ComponentEntry[] {
  const componentEntries: ComponentEntry[] = [];

  // Now, parse into an AST so we can introspect more
  const parsedFile = parseSync(filePath, fileContents, {
    sourceType: "module",
  });

  // Iterate through each statement and analyze each node for components
  for (const exportNode of parsedFile.program.body) {
    if (
      exportNode.type !== "ExportNamedDeclaration" ||
      exportNode.declaration?.type !== "ClassDeclaration"
    ) {
      continue;
    }

    // Get and validate the class name. If we don't have a class name, then this
    // is an anonymous class, which we don't support.
    const exportName = exportNode.declaration.id?.name;
    if (!exportName) {
      continue;
    }

    // Get the customElement decorator, if it exists
    const customElementDecorator = exportNode.declaration.decorators?.find(
      (decorator) =>
        decorator.type === "Decorator" &&
        decorator.expression.type === "CallExpression" &&
        decorator.expression.callee.type === "Identifier" &&
        decorator.expression.callee.name === "customElement"
    );
    if (!customElementDecorator) {
      continue;
    }

    // If we got to this point, then that means we definitely have a component
    // to analyze. From this point on, any deviation from expected AST format
    // is an error.
    const exportLoc = convertIndexToLoc(fileContents, exportNode.start);

    // Get the component name from the first argument of the decorator
    if (customElementDecorator.expression.type !== "CallExpression") {
      throw new Error(
        `CustomElement decorator at ${filePath}:${exportLoc.line}:${exportLoc.column} is not a call expression`
      );
    }
    const componentNameArgument =
      customElementDecorator.expression.arguments[0];
    if (!componentNameArgument) {
      throw new Error(
        `CustomElement decorator at ${filePath}:${exportLoc.line}:${exportLoc.column} is missing an argument`
      );
    }
    if (componentNameArgument.type !== "Literal") {
      throw new Error(
        `CustomElement decorator at ${filePath}:${exportLoc.line}:${exportLoc.column} is not a literal`
      );
    }
    const componentName = componentNameArgument.value;
    if (typeof componentName !== "string") {
      throw new Error(
        `CustomElement decorator at ${filePath}:${exportLoc.line}:${exportLoc.column} is not a string`
      );
    }

    // Get the list of events and types
    const events: Record<string, string> = {};
    const classBody = exportNode.declaration.body.body;
    for (const member of classBody) {
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
      const decoratorLoc = convertIndexToLoc(
        fileContents,
        eventDecorator.start
      );

      // Get the event type from decorator options
      const decoratorArg = eventDecorator.expression.arguments[0];
      if (decoratorArg?.type !== "ObjectExpression") {
        throw new Error(
          `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is not an object expression`
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
          `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is missing a type property`
        );
      }

      // Get the type parameter from EventDispatcher<T>
      const typeAnnotation = member.typeAnnotation?.typeAnnotation;
      if (!typeAnnotation?.type || typeAnnotation.type !== "TSTypeReference") {
        throw new Error(
          `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is not a type reference`
        );
      }
      if (
        typeAnnotation.typeName.type !== "Identifier" ||
        typeAnnotation.typeName.name !== "EventDispatcher" ||
        !typeAnnotation.typeArguments
      ) {
        throw new Error(
          `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is not a type reference`
        );
      }
      const typeParam = typeAnnotation.typeArguments.params[0];
      if (!typeParam) {
        throw new Error(
          `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is missing a type parameter`
        );
      }
      if (typeParam.type === "TSNullKeyword") {
        events[eventType] = "null";
      } else if (typeParam.type === "TSUndefinedKeyword") {
        events[eventType] = "undefined";
      } else {
        if (
          typeParam.type !== "TSTypeReference" ||
          typeParam.typeName?.type !== "Identifier"
        ) {
          throw new Error(
            `Event decorator at ${filePath}:${decoratorLoc.line}:${decoratorLoc.column} is not a type reference`
          );
        }
        events[eventType] = typeParam.typeName.name;
      }
    }

    // Store the data
    componentEntries.push({
      exportName,
      filePath,
      componentName,
      events,
    });
  }

  return componentEntries;
}

function getComponentDetails() {
  const components: ComponentEntry[] = [];
  const componentsDir = join(SRC_DIR, "components");
  const files = readdirSync(componentsDir, {
    recursive: true,
    encoding: "utf-8",
  }).sort();
  const globalEventTypes = new Set<string>();
  for (const filePathSegment of files) {
    const filePath = join(componentsDir, filePathSegment);
    if (!filePath.endsWith(".ts")) {
      continue;
    }

    // Do a quick check to determine the components in this file. We'll later
    // use this data to short-circuit and validate our AST crawling
    const fileContents = readFileSync(filePath, "utf-8");
    const componentNames = Array.from(
      fileContents.matchAll(/@customElement\("(.*?)"\)/g)
    ).map(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (match) => match[1]!
    );

    // If we don't define any components, then we can skip this file
    if (!componentNames.length) {
      continue;
    }

    // Get the component details
    const fileComponents = getComponentDetailsForFile({
      filePath,
      fileContents,
    });

    // Sanity check that we found everything. If we didn't, then someone likely
    // forgot to export the class (which is needed for typing)
    for (const componentName of componentNames) {
      if (!fileComponents.find((c) => c.componentName === componentName)) {
        throw new Error(
          `Component ${componentName} not found in ${filePath}. Did you forget to export it?`
        );
      }
    }

    // Add the events to the global set and ensure uniqueness
    for (const fileComponent of fileComponents) {
      for (const eventName of Object.keys(fileComponent.events)) {
        if (globalEventTypes.has(eventName)) {
          throw new Error(
            `Event type ${eventName} is defined multiple times in the codebase. Each event must be globally unique`
          );
        }
        globalEventTypes.add(eventName);
      }
    }

    // Add the components to the list
    components.push(...fileComponents);
  }

  // Validate that each file is imported in index.ts
  const indexPath = join(SRC_DIR, "index.ts");
  const parsedIndex = parseSync(indexPath, readFileSync(indexPath, "utf-8"), {
    sourceType: "module",
  });
  const importedFiles = new Set<string>();
  for (const importStatement of parsedIndex.module.staticImports) {
    if (!importStatement.moduleRequest.value.startsWith("./components")) {
      continue;
    }
    importedFiles.add(importStatement.moduleRequest.value);
  }
  const componentFiles = new Set(
    components.map((c) => "." + c.filePath.replace(SRC_DIR, ""))
  );
  for (const componentFile of componentFiles) {
    if (!importedFiles.has(componentFile)) {
      throw new Error(
        `Component file ${componentFile} is not imported in ${indexPath}`
      );
    }
  }

  return components;
}

async function generateAmbientDeclarations(components: ComponentEntry[]) {
  const imports = components
    .map(({ filePath, exportName, events }) => {
      const relativePath = filePath.replace(SRC_DIR, "");
      const eventTypeNames = Object.values(events).filter(
        (eventType) => eventType !== "null" && eventType !== "undefined"
      );
      const allImports = [exportName, ...eventTypeNames];
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
  .map(([, { exportName, componentName }]) => {
    return `    "${componentName}": ${exportName};`;
  })
  .join("\n")}
  }${eventMapEntries}
}`;

  const reactCustomElement = `declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
${Array.from(components.entries())
  .map(([, { exportName, componentName }]) => {
    return `      "${componentName}": ReactCustomElement<${exportName}>;`;
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

  // Format the source using Prettier
  const formattedSource = await format(ambientSource, {
    parser: "typescript",
    filepath: join(SRC_DIR, "types/ambient.ts"),
  });

  writeFileSync(join(SRC_DIR, "types/ambient.ts"), formattedSource);
}

await generateAmbientDeclarations(getComponentDetails());
