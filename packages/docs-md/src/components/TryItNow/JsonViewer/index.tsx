import { Branch } from "./Branch.tsx";

export type JsonViewerProps = {
  json: Record<string, unknown>;
  rootName?: string;
  level?: number;
  isLastItem?: boolean;
};

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
    <Branch
      json={json}
      rootName={rootName}
      level={level}
      isLastItem={isLastItem}
      parentKey={rootName ?? "root"}
    />
  );
};
