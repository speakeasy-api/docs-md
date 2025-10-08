import {
  OperationProps,
  useChildren,
  useUniqueChild,
} from "@speakeasy-api/docs-md-react";

export function Operation({ children }: OperationProps) {
  const titleChild = useUniqueChild(children, "title");
  const summaryChildren = useChildren(children, "summary");
  const descriptionChildren = useChildren(children, "description");
  const codeSamplesChildren = useChildren(children, "code-samples");
  const securityChildren = useChildren(children, "security");
  const parametersChildren = useChildren(children, "parameters");
  const requestBodyExamplesChildren = useChildren(
    children,
    "request-body-examples"
  );
  const requestBodyChildren = useChildren(children, "request-body");
  const responseBodyExamplesChildren = useChildren(
    children,
    "response-body-examples"
  );
  const responseBodyChildren = useChildren(children, "response-body");
  return (
    <>
      <div
        style={{
          borderBottom: "1px solid var(--speakeasy-border-color)",
          paddingBottom: "0.75rem",
        }}
      >
        {titleChild}
      </div>
      {summaryChildren}
      {descriptionChildren}
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            flex: "0 1 50%",
            minWidth: 0,
            borderRight: "1px solid var(--speakeasy-border-color)",
            paddingRight: "1rem",
          }}
        >
          {securityChildren}
          {parametersChildren}
          {requestBodyChildren}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            flex: "0 1 50%",
            minWidth: 0,
          }}
        >
          {responseBodyChildren}
        </div>
      </div>
    </>
  );
}
