import { atom, useAtomValue, useSetAtom } from "jotai";
export type JsonViewerProps = {
  json: Record<string, unknown>;
  rootName?: string;
};

const expandedGroupsAtom = atom<Map<string, boolean>>(
  new Map([["root", true]])
);

const setIsExpandedGroupAtom = atom(
  null,
  (get, set, groupName: string, expanded: boolean) => {
    set(
      expandedGroupsAtom,
      new Map(get(expandedGroupsAtom).set(groupName, expanded))
    );
  }
);

const getIsExpandedGroupAtom = atom((get) => {
  return (groupName: string) => get(expandedGroupsAtom).get(groupName) ?? true;
});

const CaretIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    style={{
      display: "inline-block",
      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
      marginRight: "4px",
    }}
  >
    <path
      d="M4 2 L8 6 L4 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const JsonViewer = ({ json, rootName }: JsonViewerProps) => {
  const currentLevelKeys = Object.keys(json);
  if (!currentLevelKeys.length) {
    return null;
  }

  return <JsonNode json={json} rootName={rootName} />;
};

const JsonNode = ({ json, rootName }: JsonViewerProps) => {
  const isRoot = !!rootName;
  const isExpanded = rootName
    ? useAtomValue(getIsExpandedGroupAtom)(rootName)
    : true;
  const setIsExpanded = useSetAtom(setIsExpandedGroupAtom);
  const currentLevelKeys = Object.keys(json);

  const createFormattedObjectNode = (key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      return (
        <JsonNode
          key={key}
          rootName={key}
          json={value as Record<string, unknown>}
        />
      );
    }

    if (value === null) {
      return (
        <div key={key} style={{ marginLeft: "20px" }}>{`"${key}": null`}</div>
      );
    }

    if (value === undefined) {
      return (
        <div
          key={key}
          style={{ marginLeft: "20px" }}
        >{`"${key}": undefined`}</div>
      );
    }

    const formattedValue =
      typeof value === "string" ? `"${value}"` : String(value);
    return (
      <div
        key={key}
        style={{ marginLeft: "20px" }}
      >{`"${key}": ${formattedValue}`}</div>
    );
  };

  // Collapsed state for nested objects
  if (!isExpanded && isRoot) {
    return (
      <div
        style={{ marginLeft: "20px", cursor: "pointer" }}
        onClick={() => setIsExpanded(rootName, true)}
      >
        <CaretIcon isExpanded={false} />
        <span style={{ color: "#0066cc" }}>"{rootName}"</span>: {`{ ... }`}
      </div>
    );
  }

  // Expanded state for nested objects
  if (isExpanded && isRoot) {
    return (
      <div style={{ marginLeft: "20px" }}>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setIsExpanded(rootName, false)}
        >
          <CaretIcon isExpanded={true} />
          <span style={{ color: "#0066cc" }}>"{rootName}"</span>: {`{`}
        </div>
        <div style={{ marginLeft: "20px" }}>
          {currentLevelKeys.map((key) => {
            return createFormattedObjectNode(key, json[key]);
          })}
        </div>
        <div>{`}`}</div>
      </div>
    );
  }

  // Root level rendering
  return (
    <div>
      <div>{`{`}</div>
      <div style={{ marginLeft: "20px" }}>
        {currentLevelKeys.map((key) => {
          return createFormattedObjectNode(key, json[key]);
        })}
      </div>
      <div>{`}`}</div>
    </div>
  );
};
