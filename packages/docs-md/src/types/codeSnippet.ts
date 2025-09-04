export type CodeSnippet = {
  operationId: string;
  language: string;
  code: string;

  // This property isn't returned from the API, but we need it for other uses
  // and have it as part of forming the request
  packageName: string;
};

export type CodeSamplesResponse = {
  snippets: Omit<CodeSnippet, "packageName">[];
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};
