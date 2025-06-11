export type UsageSnippet = {
  /**
   * The title of the snippet.
   */
    operationId: string;
  
    /**
     * The code of the snippet.
     */
    content: string;
}

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
  operations: Operation[];
}
