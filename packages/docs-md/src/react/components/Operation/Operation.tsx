import styles from "./styles.module.css";
import type {
  OperationCodeSamplesSectionProps,
  OperationFrontMatterSectionProps,
  OperationParametersSectionProps,
  OperationProps,
  OperationRequestBodySectionProps,
  OperationResponseBodySectionProps,
  OperationSecuritySectionProps,
} from "./types.ts";

/**
 * This component is a container for an operation. It contains the following
 * sections:
 *
 * - Front matter: assigned to the `front-matter` slot
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
  return <div className={styles.operation}>{children}</div>;
}

/**
 * This component represents the front matter section of an operation. It is
 * assigned to the `front-matter` slot and contains the title (method and path),
 * summary, and description of the operation.
 */
export function OperationFrontMatterSection({
  children,
}: OperationFrontMatterSectionProps) {
  return <div slot="front-matter">{children}</div>;
}

/**
 * This component represents the code samples section of an operation. It is
 * assigned to the `code-samples` slot and contains the code samples for the
 * operation. These code samples are rendered in a tabbed interface, and each
 * code sample may be rendered as Try It Now or as a static code sample.
 */
export function OperationCodeSamplesSection({
  children,
}: OperationCodeSamplesSectionProps) {
  return <div slot="code-samples">{children}</div>;
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
}: OperationSecuritySectionProps) {
  return <div slot="security">{children}</div>;
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
}: OperationParametersSectionProps) {
  return <div slot="parameters">{children}</div>;
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
 */
export function OperationRequestBodySection({
  children,
}: OperationRequestBodySectionProps) {
  return <div slot="request-body">{children}</div>;
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
 */
export function OperationResponseBodySection({
  children,
}: OperationResponseBodySectionProps) {
  return <div slot="response-body">{children}</div>;
}
