import type { PropsWithChildren } from "react";

export function Operation({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export function TryItNowSection({ children }: PropsWithChildren) {
  return <div slot="try-it-now">{children}</div>;
}

export function SecuritySection({ children }: PropsWithChildren) {
  return <div slot="security">{children}</div>;
}

export function ParametersSection({ children }: PropsWithChildren) {
  return <div slot="parameters">{children}</div>;
}

export function RequestBodySection({ children }: PropsWithChildren) {
  return <div slot="request-body">{children}</div>;
}

export function ResponseBodySection({ children }: PropsWithChildren) {
  return <div slot="response-body">{children}</div>;
}
