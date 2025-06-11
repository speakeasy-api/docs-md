import type { UsageSnippet } from "./usageSnippet";

type DocInfo = {
  title: string;
  summary: string;
  description: string;
  version: string;
}

type Operation = {
  operationID: string;
  name: string;
  description: string;
}

export type AST = {
  openAPIVersion: string;
  docInfo: DocInfo;
  groupTree: GroupTree;
  operations: Operation[];
}

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
  }[]) => Promise<UsageSnippet[]>;
  const SerializeSandboxAST: (spec: [string]) => Promise<string>;
}

// This export makes TypeScript treat this file as a module
export {};
