import { useSandpackConsole } from "@codesandbox/sandpack-react";
import type { Theme } from "react-base16-styling";
import { JSONTree } from "react-json-tree";
const LogDataView = ({
  log,
  theme,
}: {
  log: ReturnType<typeof useSandpackConsole>["logs"][number];
  theme?: Theme;
}) => {
  // log is always an object
  const { data } = log;

  if (!data) return null;

  return (
    <div>
      {data.map((item, index) => {
        console.log("item", item);
        if (typeof item === "string") {
          return (
            <pre key={index}>
              <code style={{ color: "var(--sp-syntax-color-string)" }}>
                "{item}"
              </code>
            </pre>
          );
        }
        if (Array.isArray(item)) {
          return <div>[{item.join(", ")}]</div>;
        }
        return <JSONTree hideRoot key={index} theme={theme} data={item} />;
      })}
    </div>
  );
};

type ConsoleOutputProps = {
  theme?: Theme;
};

export const ConsoleOutput = ({ theme }: ConsoleOutputProps) => {
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
        <LogDataView log={log} theme={theme} />
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
