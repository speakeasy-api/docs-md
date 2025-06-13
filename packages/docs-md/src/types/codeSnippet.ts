export type CodeSnippet = {
  operationId: string;
  language: string;
  code: string;
};

export type CodeSamplesResponse = {
  snippets: CodeSnippet[];
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};
