import { useChildren, useUniqueChild } from "../../util/hooks.ts";
import styles from "./styles.module.css";
import type {
  OperationCodeSamplesSectionProps,
  OperationDescriptionSectionProps,
  OperationParametersSectionProps,
  OperationProps,
  OperationRequestBodyDefaultValueSectionProps,
  OperationRequestBodyDescriptionSectionProps,
  OperationRequestBodyDisplayTypeSectionProps,
  OperationRequestBodyExamplesSectionProps,
  OperationRequestBodySectionProps,
  OperationResponseBodyDefaultValueSectionProps,
  OperationResponseBodyDescriptionSectionProps,
  OperationResponseBodyDisplayTypeSectionProps,
  OperationResponseBodyExamplesSectionProps,
  OperationResponseBodySectionProps,
  OperationSecuritySectionProps,
  OperationSummarySectionProps,
  OperationTitleSectionProps,
} from "./types.ts";

/**
 * This component is a container for an operation. It contains the following
 * sections, if supplied:
 *
 * - Description: assigned to the `descriptions` slot
 * - Code samples: assigned to the `code-samples` slot
 * - Security: assigned to the `security` slot
 * - Parameters: assigned to the `parameters` slot
 * - Request body: assigned to the `request-body` slot
 * - Response body: assigned to the `response-body` slot
 *
 * Each child represents a semantic part of an operation and is assigned to a
 * named slot. These slots allow this container, or any overridden version of it,
 * to layout the children in the desired way.
 */
export function Operation({ children }: OperationProps) {
  const titleChild = useUniqueChild(children, "title");
  const summaryChild = useUniqueChild(children, "summary");
  const descriptionChildren = useChildren(children, "description");
  const codeSamplesChildren = useChildren(children, "code-samples");
  const securityChildren = useChildren(children, "security");
  const parametersChildren = useChildren(children, "parameters");
  const requestBodyChildren = useChildren(children, "request-body");
  const responseBodyChildren = useChildren(children, "response-body");
  return (
    <div className={styles.operation}>
      <div>
        {titleChild}
        {summaryChild}
        {descriptionChildren}
      </div>
      {codeSamplesChildren}
      {securityChildren}
      {parametersChildren}
      {requestBodyChildren}
      {responseBodyChildren}
    </div>
  );
}

/**
 * This component contains the title (method and path) of an operation and is
 * assigned to the `title` slot.
 */
export function OperationTitleSection({
  children,
  slot,
}: OperationTitleSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component contains the summary of an operation and is assigned
 * to the `summary` slot.
 */
export function OperationSummarySection({
  children,
  slot,
}: OperationSummarySectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component contains the description of an operation and is assigned
 * to the `description` slot.zs
 */
export function OperationDescriptionSection({
  children,
  slot,
}: OperationDescriptionSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component represents the code samples section of an operation. It is
 * assigned to the `code-samples` slot and contains the code samples for the
 * operation. These code samples are rendered in a tabbed interface, and each
 * code sample may be rendered as Try It Now or as a static code sample.
 */
export function OperationCodeSamplesSection({
  children,
  slot,
}: OperationCodeSamplesSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component represents the security section of an operation. It is
 * assigned to the `security` slot and contains the security information for
 * the operation.
 *
 * Each security field is effectively treated as a property in a schema, and is
 * rendered using the same mechanism used to render request and response bodies.
 */
export function OperationSecuritySection({
  children,
  slot,
}: OperationSecuritySectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component represents the parameters section of an operation. It is
 * assigned to the `parameters` slot and contains the parameters for the
 * operation.
 *
 * Each parameter is effectively treated as a property in a schema, and is
 * rendered using the same mechanism used to render request and response
 * bodies.
 */
export function OperationParametersSection({
  children,
  slot,
}: OperationParametersSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component represents the request body section of an operation. It is
 * assigned to the `request-body` slot and contains the request body for the
 * operation.
 *
 * The top level of a request body may not necessarily be a schema ref itself
 * (e.g. it may be defined as a union of several schemas, or an array of
 * schemas). We render front-matter a little differently here, but once we
 * render out the first level of information in the schema, the rest is rendered
 * as a standard schema.
 *
 * This component takes the following children:
 *
 * - `OperationRequestBodyDisplayTypeSection`: assigned to the
 *   `request-body-display-type` slot
 * - `OperationRequestBodyDescriptionSection`: assigned to the
 *   `request-body-description` slot
 * - `OperationRequestBodyExamplesSection`: assigned to the
 *   `request-body-examples` slot
 * - `OperationRequestBodyDefaultValueSection`: assigned to the
 *   `request-body-default-value` slot
 */
export function OperationRequestBodySection({
  children,
  slot,
}: OperationRequestBodySectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `request-body-display-type` slot and
 * if the request body is _not_ an object,contains the display type of the request body for the operation
 */
export function OperationRequestBodyDisplayTypeSection({
  children,
  slot,
}: OperationRequestBodyDisplayTypeSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `request-body-description` slot and
 * contains the description of the request body for the operation.
 */
export function OperationRequestBodyDescriptionSection({
  children,
  slot,
}: OperationRequestBodyDescriptionSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `request-body-examples` slot and
 * contains the examples of the request body for the operation.
 */
export function OperationRequestBodyExamplesSection({
  children,
  slot,
}: OperationRequestBodyExamplesSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `request-body-default-value` slot and
 * contains the default value of the request body for the operation.
 */
export function OperationRequestBodyDefaultValueSection({
  children,
  slot,
}: OperationRequestBodyDefaultValueSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component represents the response bodies of an operation. It is assigned
 * to the `response-body` slot and contains a tabbed interface for displaying
 * the different response bodies.
 *
 * The top level of a response body may not necessarily be a schema ref itself
 * (e.g. it may be defined as a union of several schemas, or an array of
 * schemas). We render front-matter a little differently in each tab, but once
 * we render out the first level of information in the schema, the rest is
 * rendered as a standard schema.
 *
 * This component takes the following children:
 *
 * - `OperationResponseBodyDisplayTypeSection`: assigned to the
 *   `response-body-display-type` slot
 * - `OperationResponseBodyDescriptionSection`: assigned to the
 *   `response-body-description` slot
 * - `OperationResponseBodyExamplesSection`: assigned to the
 *   `response-body-examples` slot
 * - `OperationResponseBodyDefaultValueSection`: assigned to the
 *   `response-body-default-value` slot
 */
export function OperationResponseBodySection({
  children,
  slot,
}: OperationResponseBodySectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `response-body-display-type` slot and
 * if the response body is _not_ an object,contains the display type of the response body for the operation
 */
export function OperationResponseBodyDisplayTypeSection({
  children,
  slot,
}: OperationResponseBodyDisplayTypeSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `response-body-description` slot and
 * contains the description of the response body for the operation.
 */
export function OperationResponseBodyDescriptionSection({
  children,
  slot,
}: OperationResponseBodyDescriptionSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `response-body-examples` slot and
 * contains the examples of the response body for the operation.
 */
export function OperationResponseBodyExamplesSection({
  children,
  slot,
}: OperationResponseBodyExamplesSectionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * This component is assigned to the `response-body-default-value` slot and
 * contains the default value of the response body for the operation.
 */
export function OperationResponseBodyDefaultValueSection({
  children,
  slot,
}: OperationResponseBodyDefaultValueSectionProps) {
  return <div slot={slot}>{children}</div>;
}
