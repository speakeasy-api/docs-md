"use client";

import {
  useSandpackConsole,
  useSandpackTheme,
} from "@codesandbox/sandpack-react";
import { Console, Decode } from "console-feed";
import type { Methods } from "console-feed/lib/definitions/Methods.js";
import { useEffect, useState } from "react";

type SandpackConsoleData = ReturnType<
  typeof useSandpackConsole
>["logs"][number];

type SandpackEncodedLog = {
  "@t"?: string;
  data?: unknown;
};

type Message = {
  id: string;
  data: unknown[];
  method: Methods;
};

function encodeLog(log: SandpackConsoleData): Message {
  // deep copy the log.data array
  if (!log.data) {
    return Decode([]) as Message;
  }
  const modifiedDataArray = log.data;
  if (Array.isArray(modifiedDataArray)) {
    // Due to formatting changes with console-feed's encode function in v3.4
    // we need to manually add in the remainder key to note that there
    // are no more items remaining
    modifiedDataArray.push("__console_feed_remaining__0");
    // Objects all need to have a constructor property now too
    // unless it is null
    modifiedDataArray.forEach((dataItem) => {
      if (
        typeof dataItem !== "string" &&
        (dataItem as unknown as SandpackEncodedLog)?.["@t"]
      ) {
        const sandpackEncodedLog = dataItem as unknown as SandpackEncodedLog;
        if (sandpackEncodedLog["@t"] === "[[undefined]]") {
          return;
        }

        // Hey keep going and actually write this as a function to note
        // that we are essentially an adapter for v3.3 and the newest version of console-feed
        const constructorType = sandpackEncodedLog?.["@t"]?.slice(2, -2);
        Object.assign(dataItem, {
          constructor: {
            name: constructorType,
          },
        });
        delete sandpackEncodedLog["@t"];
      }
    });
  }
  return Decode([{ ...log, data: modifiedDataArray }]) as Message;
}

export function ConsoleOutput() {
  const [logs, setLogs] = useState<Message[]>([]);
  const { theme, themeMode } = useSandpackTheme();
  const { logs: sandpackLogs } = useSandpackConsole({
    resetOnPreviewRestart: true,
  });

  useEffect(() => {
    const encodedLogArr = sandpackLogs.map(encodeLog);
    setLogs(encodedLogArr);
  }, [sandpackLogs]);

  return (
    <div
      style={{
        flex: "1 1 0px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        overflow: "hidden",
        backgroundColor: theme.colors.surface1,
      }}
    >
      <div
        style={{
          overflow: "auto",
          flex: "1 1 0px",
          fontSize: "1em",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "var(--sp-space-3) var(--sp-space-2)",
          }}
        >
          <Console
            variant={themeMode === "dark" ? "dark" : "light"}
            styles={{
              BASE_COLOR: theme.syntax.plain,
              BASE_FONT_FAMILY: theme.font.mono,
              BASE_BACKGROUND_COLOR: theme.colors.surface1,
              BASE_FONT_SIZE: theme.font.size,
              LOG_COLOR: theme.colors.base,

              OBJECT_VALUE_NULL_COLOR: theme.syntax.property,
              OBJECT_KEY_COLOR: theme.syntax.property,
              OBJECT_NAME_COLOR: theme.syntax.property,
              OBJECT_VALUE_UNDEFINED_COLOR: theme.syntax.plain,
              OBJECT_VALUE_STRING_COLOR: theme.syntax.string,
              OBJECT_VALUE_BOOLEAN_COLOR: theme.syntax.static,
              OBJECT_VALUE_NUMBER_COLOR: theme.syntax.static,
              OBJECT_VALUE_FUNCTION_KEYWORD_COLOR: theme.syntax.keyword,
            }}
            logs={logs}
          />
        </div>
      </div>
    </div>
  );
}
