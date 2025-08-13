import type { PropsWithChildren } from "react";

export function Operation({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export function OperationFrontMatterSection({ children }: PropsWithChildren) {
  return <div slot="front-matter">{children}</div>;
}

export function OperationTryItNowSection({ children }: PropsWithChildren) {
  return <div slot="try-it-now">{children}</div>;
}

export function OperationSecuritySection({ children }: PropsWithChildren) {
  return <div slot="security">{children}</div>;
}

export function OperationParametersSection({ children }: PropsWithChildren) {
  return <div slot="parameters">{children}</div>;
}

export function OperationRequestBodySection({ children }: PropsWithChildren) {
  return <div slot="request-body">{children}</div>;
}

export function OperationResponseBodySection({ children }: PropsWithChildren) {
  return <div slot="response-body">{children}</div>;
}
