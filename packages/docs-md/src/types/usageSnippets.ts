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

