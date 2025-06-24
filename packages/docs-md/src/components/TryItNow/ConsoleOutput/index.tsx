import { useSandpackConsole } from "@codesandbox/sandpack-react";

import { JsonViewer } from "../JsonViewer/index.tsx";

const LogDataView = ({
  log,
}: {
  log:
    | Array<string | Record<string, string>>
    | Record<string, string>
    | undefined
    | string;
}) => {
  if (typeof log === "string" || !log) {
    return (
      <pre>
        <code style={{ color: "var(--sp-syntax-color-string)" }}>"{log}"</code>
      </pre>
    );
  }

  if (Array.isArray(log)) {
    return (
      <div>
        {log.map((item, index) => (
          <LogDataView key={index} log={item} />
        ))}
      </div>
    );
  }

  return <JsonViewer json={log} />;
};

export const ConsoleOutput = () => {
  const { logs } = useSandpackConsole({
    resetOnPreviewRestart: true,
  });

  const renderedLogs = logs.map((log) => {
    return (
      <div
        key={log.id}
        style={{
          width: "100%",
          padding: "var(--sp-space-3) var(--sp-space-2)",
        }}
      >
        <LogDataView log={log.data} />
      </div>
    );
  });

  return (
    <div
      style={{
        flex: "1 1 0px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        overflow: "hidden",
        background: "var(--sp-colors-surface1)",
        lineHeight: "var(--sp-font-lineHeight)",
      }}
    >
      <div
        style={{
          overflow: "auto",
          flex: "1 1 0px",
          fontSize: "1em",
        }}
      >
        {renderedLogs}
      </div>
    </div>
  );
};
