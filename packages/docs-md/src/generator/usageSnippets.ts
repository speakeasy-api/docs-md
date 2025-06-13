import type { UsageSnippet } from "../types/usageSnippets.ts";

const usageSnippets = new Map<string, UsageSnippet>();

export function setUsageSnippet(snippet: UsageSnippet) {
  usageSnippets.set(snippet.operationId, snippet);
}

export function getUsageSnippet(operationId: string) {
  return usageSnippets.get(operationId);
}

