import type { PropsWithChildren } from "react";

export type OperationProps = PropsWithChildren;
export type OperationTitleSectionProps = PropsWithChildren<{ slot: "title" }>;
export type OperationSummarySectionProps = PropsWithChildren<{
  slot: "summary";
}>;
export type OperationDescriptionSectionProps = PropsWithChildren<{
  slot: "description";
}>;
export type OperationCodeSamplesSectionProps = PropsWithChildren<{
  slot: "code-samples";
}>;
export type OperationSecuritySectionProps = PropsWithChildren<{
  slot: "security";
}>;
export type OperationParametersSectionProps = PropsWithChildren<{
  slot: "parameters";
}>;

export type OperationRequestBodySectionProps = PropsWithChildren<{
  slot: "request-body";
}>;
export type OperationRequestBodyDisplayTypeSectionProps = PropsWithChildren<{
  slot: "request-body-display-type";
}>;
export type OperationRequestBodyDescriptionSectionProps = PropsWithChildren<{
  slot: "request-body-description";
}>;
export type OperationRequestBodyExamplesSectionProps = PropsWithChildren<{
  slot: "request-body-examples";
}>;
export type OperationRequestBodyDefaultValueSectionProps = PropsWithChildren<{
  slot: "request-body-default-value";
}>;

export type OperationResponseBodySectionProps = PropsWithChildren<{
  slot: "response-body";
}>;
export type OperationResponseBodyDisplayTypeSectionProps = PropsWithChildren<{
  slot: "response-body-display-type";
}>;
export type OperationResponseBodyDescriptionSectionProps = PropsWithChildren<{
  slot: "response-body-description";
}>;
export type OperationResponseBodyExamplesSectionProps = PropsWithChildren<{
  slot: "response-body-examples";
}>;
export type OperationResponseBodyDefaultValueSectionProps = PropsWithChildren<{
  slot: "response-body-default-value";
}>;
