export type UsageSnippet = {
  operationId: string;
  language: string;
  code: string;
};

export type CodeSamplesResponse = {
  snippets: UsageSnippet[];
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};

type DocInfo = {
  title: string;
  summary: string;
  description: string;
  version: string;
};

type Operation = {
  operationID: string;
  name: string;
  description: string;
};

export type AST = {
  openAPIVersion: string;
  docInfo: DocInfo;
  operations: Operation[];
};
