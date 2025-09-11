declare global {
  const SerializeDocsData: (spec: string) => Promise<string>;
}

// This export makes TypeScript treat this file as a module
export {};
