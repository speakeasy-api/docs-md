import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExportNamedDeclaration } from "oxc-parser";
import { parseSync } from "oxc-parser";

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src");

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

  return components;
}

type ComponentEntry = { symbol: string; componentName: string };

function getComponentData(components: Map<string, string>) {
  const componentData = new Map<string, ComponentEntry>();

  for (const [filePath, symbol] of components) {
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

    // Store the data
    componentData.set(filePath, {
      symbol,
      componentName,
    });
  }

  return componentData;
}

function generateAmbientDeclarations(components: Map<string, ComponentEntry>) {
  const imports = Array.from(components.entries())
    .map(([filePath, { symbol }]) => {
      const relativePath = filePath.replace(SRC_DIR, "");
      return `import type { ${symbol} } from "..${relativePath}";`;
    })
    .join("\n");

  const nameMap = `declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HTMLElementTagNameMap {
${Array.from(components.entries())
  .map(([, { symbol, componentName }]) => {
    return `    "${componentName}": ${symbol};`;
  })
  .join("\n")}
  }
}`;

  const reactCustomElement = `declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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

${imports}
import type { ReactCustomElement } from "./components.ts";

${nameMap}

${reactCustomElement}
`;

  writeFileSync(join(SRC_DIR, "types/ambient.ts"), ambientSource);
}

generateAmbientDeclarations(getComponentData(getComponentList()));
