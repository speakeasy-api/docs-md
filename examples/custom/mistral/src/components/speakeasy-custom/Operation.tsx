import { OperationProps, useChildren } from "@speakeasy-api/docs-md-react";

export function Operation({ children }: OperationProps) {
  const titleSection = useChildren(children, "title")[0];
  const summarySection = useChildren(children, "summary")[0];
  const descriptionSection = useChildren(children, "description")[0];
  const tryItNowSection = useChildren(children, "code-samples")[0];
  const securitySection = useChildren(children, "security")[0];
  const parametersSection = useChildren(children, "parameters")[0];
  const requestBodySection = useChildren(children, "request-body")[0];
  const responseBodySection = useChildren(children, "response-body")[0];
  return (
    <>
      <div
        style={{
          borderBottom: "1px solid var(--speakeasy-border-color)",
          paddingBottom: "0.75rem",
        }}
      >
        {titleSection}
      </div>
      {summarySection}
      {descriptionSection}
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <div
          style={{
            flex: "0 1 50%",
            minWidth: 0,
            borderRight: "1px solid var(--speakeasy-border-color)",
            paddingRight: "1rem",
          }}
        >
          {securitySection}
          {parametersSection}
          {requestBodySection}
          {responseBodySection}
        </div>
        <div style={{ flex: "0 1 50%", minWidth: 0 }}>
          {tryItNowSection ?? <div></div>}
        </div>
      </div>
    </>
  );
}
