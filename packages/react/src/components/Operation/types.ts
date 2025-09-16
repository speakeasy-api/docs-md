import type { PropsWithChildren } from "react";

export type OperationProps = PropsWithChildren;
export type OperationTitleSectionProps = PropsWithChildren<{
  /**
   * The slot for the title, always "title"
   */
  slot: "title";
}>;
export type OperationSummarySectionProps = PropsWithChildren<{
  /**
   * The slot for the summary, always "summary"
   */
  slot: "summary";
}>;
export type OperationDescriptionSectionProps = PropsWithChildren<{
  /**
   * The slot for the description, always "description"
   */
  slot: "description";
}>;
export type OperationCodeSamplesSectionProps = PropsWithChildren<{
  /**
   * The slot for the code samples, always "code-samples"
   */
  slot: "code-samples";
}>;
export type OperationSecuritySectionProps = PropsWithChildren<{
  /**
   * The slot for the security, always "security"
   */
  slot: "security";
}>;
export type OperationParametersSectionProps = PropsWithChildren<{
  /**
   * The slot for the parameters, always "parameters"
   */
  slot: "parameters";
}>;

export type OperationRequestBodySectionProps = PropsWithChildren<{
  /**
   * The slot for the request body, always "request-body"
   */
  slot: "request-body";
}>;
export type OperationRequestBodyDisplayTypeSectionProps = PropsWithChildren<{
  /**
   * The slot for the request body display type, always "request-body-display-type"
   */
  slot: "request-body-display-type";
}>;
export type OperationRequestBodyDescriptionSectionProps = PropsWithChildren<{
  /**
   * The slot for the request body description, always "request-body-description"
   */
  slot: "request-body-description";
}>;
export type OperationRequestBodyExamplesSectionProps = PropsWithChildren<{
  /**
   * The slot for the request body examples, always "request-body-examples"
   */
  slot: "request-body-examples";
}>;
export type OperationRequestBodyDefaultValueSectionProps = PropsWithChildren<{
  /**
   * The slot for the request body default value, always "request-body-default-value"
   */
  slot: "request-body-default-value";
}>;

export type OperationResponseBodySectionProps = PropsWithChildren<{
  /**
   * The slot for the response body, always "response-body"
   */
  slot: "response-body";
}>;
export type OperationResponseBodyDisplayTypeSectionProps = PropsWithChildren<{
  /**
   * The slot for the response body display type, always "response-body-display-type"
   */
  slot: "response-body-display-type";
}>;
export type OperationResponseBodyDescriptionSectionProps = PropsWithChildren<{
  /**
   * The slot for the response body description, always "response-body-description"
   */
  slot: "response-body-description";
}>;
export type OperationResponseBodyExamplesSectionProps = PropsWithChildren<{
  /**
   * The slot for the response body examples, always "response-body-examples"
   */
  slot: "response-body-examples";
}>;
export type OperationResponseBodyDefaultValueSectionProps = PropsWithChildren<{
  /**
   * The slot for the response body default value, always "response-body-default-value"
   */
  slot: "response-body-default-value";
}>;
