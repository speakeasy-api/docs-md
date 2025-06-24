import { atom, useAtomValue, useSetAtom } from "jotai";

export type JsonViewerProps = {
  json: Record<string, unknown>;
  rootName?: string;
  level?: number;
  isLastItem?: boolean;
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

export const JsonViewer = ({
  json,
  rootName,
  level = 0,
  isLastItem = true,
}: JsonViewerProps) => {
  const currentLevelKeys = Object.keys(json);
  if (!currentLevelKeys.length) {
    return null;
  }

  return (
    <JsonNode
      json={json}
      rootName={rootName}
      level={level}
      isLastItem={isLastItem}
    />
  );
};

const JsonNode = ({
  json,
  rootName,
  level = 0,
  isLastItem = true,
}: JsonViewerProps) => {
  const isRoot = !!rootName;
  const isExpanded = rootName
    ? useAtomValue(getIsExpandedGroupAtom)(rootName)
    : true;
  const setIsExpanded = useSetAtom(setIsExpandedGroupAtom);
  const currentLevelKeys = Object.keys(json);

  const getIndentation = (currentLevel: number) => {
    return "\u00A0".repeat(currentLevel * 4); // Non-breaking spaces, 4 per level
  };

  const createFormattedObjectNode = (
    key: string,
    value: unknown,
    isLastProperty: boolean
  ) => {
    if (value === null) {
      return (
        <div style={{ whiteSpace: "nowrap" }} key={key}>
          {getIndentation(level + 1)}
          {`"${key}": null`}
          {isLastProperty ? "" : ","}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <JsonNode
          key={key}
          rootName={key}
          json={value as Record<string, unknown>}
          level={level + 1}
          isLastItem={isLastProperty}
        />
      );
    }

    if (value === undefined) {
      return (
        <div style={{ whiteSpace: "nowrap" }} key={key}>
          {getIndentation(level + 1)}
          {`"${key}": undefined`}
          {isLastProperty ? "" : ","}
        </div>
      );
    }

    const syntaxColor =
      typeof value === "boolean" || typeof value === "number"
        ? "var(--sp-syntax-color-static)"
        : "var(--sp-syntax-color-string)";

    const formattedValue =
      typeof value === "string"
        ? `"${String(value)}"`
        : String(value as boolean | number);

    return (
      <div style={{ whiteSpace: "nowrap" }} key={key}>
        {getIndentation(level + 1)}
        {`"${key}": `}
        <span style={{ color: syntaxColor }}>{formattedValue}</span>
        {isLastProperty ? "" : ","}
      </div>
    );
  };

  // Collapsed state for nested objects
  if (!isExpanded && isRoot) {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setIsExpanded(rootName, true)}
      >
        {getIndentation(level)}
        <CaretIcon isExpanded={false} />
        <span style={{ color: "#0066cc" }}>"{rootName}"</span>: {`{ ... }`}
        {isLastItem ? "" : ","}
      </div>
    );
  }

  // Expanded state for nested objects
  if (isExpanded && isRoot) {
    return (
      <div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setIsExpanded(rootName, false)}
        >
          {getIndentation(level)}
          <CaretIcon isExpanded={true} />
          <span style={{ color: "#0066cc" }}>"{rootName}"</span>: {`{`}
        </div>
        <div>
          {currentLevelKeys.map((key, index) => {
            const isLastProperty = index === currentLevelKeys.length - 1;
            return createFormattedObjectNode(key, json[key], isLastProperty);
          })}
        </div>
        <div>
          {getIndentation(level)}
          {`}`}
          {isLastItem ? "" : ","}
        </div>
      </div>
    );
  }

  // Root level rendering
  return (
    <div>
      <div>
        {getIndentation(level)}
        {`{`}
      </div>
      <div>
        {currentLevelKeys.map((key, index) => {
          const isLastProperty = index === currentLevelKeys.length - 1;
          return createFormattedObjectNode(key, json[key], isLastProperty);
        })}
      </div>
      <div>
        {getIndentation(level)}
        {`}`}
      </div>
    </div>
  );
};
