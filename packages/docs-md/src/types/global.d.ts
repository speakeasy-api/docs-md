declare global {
  const SerializeDocsData: (spec: string) => Promise<string>;
  const GenerateUsageSnippets: ([{
    schema,
    operationIds,
    target,
    config,
  }]: {
    schema: string;
    operationIds: string[];
    target: string;
    config: Record<string, string | number | boolean>;
  }[]) => Promise<string>;
  const SerializeSandboxAST: (spec: [string]) => Promise<string>;
}

// This export makes TypeScript treat this file as a module
export {};
