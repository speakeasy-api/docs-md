import { useAtomValue, useSetAtom } from "jotai";
import { memo, useMemo } from "react";

import type { JsonViewerProps } from "./index.tsx";
import { getIsExpandedGroupAtom, setIsExpandedGroupAtom } from "./state.ts";
import { getIndentation } from "./utils.ts";

type JsonNodeProps = JsonViewerProps & {
  parentKey: string;
};

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

const Leaf = ({
  json,
  level,
  parentKey,
}: {
  json: Record<string, unknown>;
  level: number;
  parentKey: string;
}) => {
  const currentLevelKeys = Object.keys(json);

  const leaf = useMemo(() => {
    return currentLevelKeys.map((key, index) => {
      const isLastProperty = index === currentLevelKeys.length - 1;

      return (
        <LeafValue
          key={key}
          objectKey={key}
          value={json[key]}
          isLastProperty={isLastProperty}
          level={level}
          parentKey={parentKey}
        />
      );
    });
  }, [json, level, parentKey]);

  return <>{leaf}</>;
};

export const Branch = ({
  json,
  rootName,
  level = 0,
  isLastItem = true,
  parentKey,
}: JsonNodeProps) => {
  const isRoot = !!rootName;
  const isExpanded = rootName
    ? useAtomValue(getIsExpandedGroupAtom)(parentKey + "." + rootName)
    : true;
  const setIsExpanded = useSetAtom(setIsExpandedGroupAtom);

  // Collapsed state for nested objects
  if (!isExpanded && isRoot) {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setIsExpanded(parentKey + "." + rootName, true)}
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
          onClick={() => setIsExpanded(parentKey + "." + rootName, false)}
        >
          {getIndentation(level)}
          <CaretIcon isExpanded={true} />
          <span style={{ color: "#0066cc" }}>"{rootName}"</span>: {`{`}
        </div>
        <div>
          <Leaf json={json} level={level} parentKey={parentKey} />
        </div>
        <div>
          {getIndentation(level)}
          {`}`}
          {isLastItem ? "" : ","}
        </div>
      </div>
    );
  }

  // Rendering for when the node is not a root node
  return (
    <div>
      <div>
        {getIndentation(level)}
        {`{`}
      </div>
      <div>
        <Leaf json={json} level={level} parentKey={parentKey} />
      </div>
      <div>
        {getIndentation(level)}
        {`}`}
      </div>
    </div>
  );
};

type LeafValueProps = {
  objectKey: string;
  value: unknown;
  isLastProperty: boolean;
  level: number;
  parentKey: string;
};

const LeafValue = memo(
  ({ objectKey, value, isLastProperty, level, parentKey }: LeafValueProps) => {
    if (value === null) {
      return (
        <div
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {getIndentation(level + 1)}
          {`"${objectKey}": `}
          <span style={{ color: "var(--sp-syntax-color-keyword)" }}>null</span>
          {isLastProperty ? "" : ","}
        </div>
      );
    }

    if (value === undefined) {
      return (
        <div style={{ whiteSpace: "nowrap" }}>
          {getIndentation(level + 1)}
          {`"${objectKey}": undefined`}
          {isLastProperty ? "" : ","}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <Branch
          rootName={objectKey}
          json={value as Record<string, unknown>}
          level={level + 1}
          isLastItem={isLastProperty}
          parentKey={parentKey + "." + objectKey}
        />
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
      <div style={{ whiteSpace: "nowrap" }}>
        {getIndentation(level + 1)}
        {`"${objectKey}": `}
        <span style={{ color: syntaxColor }}>{formattedValue}</span>
        {isLastProperty ? "" : ","}
      </div>
    );
  }
);
