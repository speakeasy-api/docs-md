import { useChildren } from "@speakeasy-api/docs-md/react";
import { PropsWithChildren } from "react";

export {
  TryItNow,
  SideBar,
  SideBarTrigger,
  ExpandableSection,
  ExpandableBreakout,
  ExpandableProperty,
  TabbedSection,
  Section,
  SectionContent,
  SectionTitle,
  SectionTab,
  Code,
  CodeSample,
  Pill,
  DebugPlaceholder,
  FrontMatterDisplayType,
  OperationFrontMatterSection,
  OperationCodeSamplesSection,
  OperationSecuritySection,
  OperationParametersSection,
  OperationRequestBodySection,
  OperationResponseBodySection,
} from "@speakeasy-api/docs-md/react";

export function Operation({ children }: PropsWithChildren) {
  const frontMatterSection = useChildren(children, "front-matter")[0];
  const tryItNowSection = useChildren(children, "code-samples")[0];
  const securitySection = useChildren(children, "security")[0];
  const parametersSection = useChildren(children, "parameters")[0];
  const requestBodySection = useChildren(children, "request-body")[0];
  const responseBodySection = useChildren(children, "response-body")[0];
  return (
    <>
      {frontMatterSection}
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
