import type { PropsWithChildren } from "react";

import { useChildren, useUniqueChild } from "../../util/hooks.ts";
import styles from "./styles.module.css";

export function Operation({ children }: PropsWithChildren) {
  const frontMatterChild = useUniqueChild(children, "front-matter");
  const tryItNowChild = useUniqueChild(children, "try-it-now");
  const securityChildren = useChildren(children, "security");
  const parametersChildren = useChildren(children, "parameters");
  const requestBodyChildren = useChildren(children, "request-body");
  const responseBodyChildren = useChildren(children, "response-body");

  return (
    <div className={styles.operation}>
      {frontMatterChild && (
        <div className={styles.frontmatter}>{frontMatterChild}</div>
      )}
      <div className={tryItNowChild ? styles.twoColumn : styles.singleColumn}>
        <div className={styles.leftColumn}>
          {securityChildren}
          {parametersChildren}
          {requestBodyChildren}
          {responseBodyChildren}
        </div>
        {tryItNowChild && (
          <div className={styles.rightColumn}>{tryItNowChild}</div>
        )}
      </div>
    </div>
  );
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
