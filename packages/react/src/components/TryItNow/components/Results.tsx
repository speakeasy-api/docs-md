"use client";

import { JSONTree } from "react-json-tree";

import type { ExtendedRuntimeEvent, ResultsProps } from "../types.ts";
import styles from "./styles.module.css";

const jsonTreeTheme = {
  scheme: "transparent",
  base00: "transparent",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

type FormattedEvent = {
  prefix?: string;
  value: unknown;
  id: string;
  level?: "log" | "warn" | "error" | "info";
};

function formatEvents(events: ExtendedRuntimeEvent[]): FormattedEvent[] {
  return events
    .map((event): FormattedEvent | undefined => {
      switch (event.type) {
        // TypeScript events
        case "typescript:compilation:error": {
          return {
            prefix: undefined,
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "typescript:execution:log": {
          return {
            prefix: undefined,
            id: event.id,
            value: event.message,
            level: event.level === "debug" ? "log" : event.level,
          };
        }
        case "typescript:execution:uncaught-exception": {
          return {
            prefix: "Uncaught Exception: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "typescript:execution:uncaught-rejection": {
          return {
            prefix: "Uncaught Rejection: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "typescript:compilation:started":
        case "typescript:compilation:finished":
        case "typescript:execution:started": {
          return undefined;
        }

        // Python events
        case "python:initialization:error": {
          return {
            prefix: "Initialization failed: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "python:execution:log": {
          return {
            prefix: undefined,
            id: event.id,
            value: event.message,
            level: event.level === "debug" ? "log" : event.level,
          };
        }
        case "python:execution:uncaught-exception": {
          return {
            prefix: "Uncaught Exception: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "python:execution:uncaught-rejection": {
          return {
            prefix: "Uncaught Rejection: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "python:initialization:started":
        case "python:initialization:finished":
        case "python:execution:started": {
          return undefined;
        }

        // Curl events
        case "curl:parse:started": {
          return undefined;
        }
        case "curl:parse:finished": {
          return undefined;
        }
        case "curl:parse:error": {
          return {
            prefix: "Parse failed: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
        case "curl:fetch:started": {
          return undefined;
        }
        case "curl:fetch:finished": {
          return {
            prefix: undefined,
            id: event.id,
            value: event.body,
            level: "log",
          };
        }
        case "curl:fetch:error": {
          return {
            prefix: "Fetch failed: ",
            id: event.id,
            value: event.error,
            level: "error",
          };
        }
      }
    })
    .filter((event): event is FormattedEvent => event !== undefined);
}

function formatResultsOutput(events: FormattedEvent[]) {
  return events.map(function (event) {
    const { prefix, value, id, level } = event;

    const className = level ? styles[level] : "";
    if (value === undefined || value === null) {
      return (
        <pre key={id} className={className + " " + styles.primitiveValue}>
          {prefix}
          {value === undefined ? "undefined" : "null"}
        </pre>
      );
    }

    if (typeof value === "object") {
      return (
        <pre key={id} className={className}>
          {prefix}
          <JSONTree
            data={value}
            hideRoot
            theme={jsonTreeTheme}
            invertTheme={false}
          />
        </pre>
      );
    }

    return (
      <pre key={id} className={className}>
        {prefix}
        {JSON.stringify(value)}
      </pre>
    );
  });
}

export function Results({ status }: ResultsProps) {
  // First, check if we don't have anything to show
  if (
    status.state === "typescript:idle" ||
    status.state === "python:idle" ||
    status.state === "curl:idle"
  ) {
    return null;
  }

  let displayOutput: FormattedEvent[] = [];
  switch (status.state) {
    case "typescript:compiling": {
      displayOutput = formatEvents(status.previousEvents);
      break;
    }
    case "typescript:compile-error": {
      displayOutput = [
        ...formatEvents(status.events),
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    case "python:initializing": {
      displayOutput = formatEvents(status.previousEvents);
      break;
    }
    case "python:initialization-error": {
      displayOutput = [
        ...formatEvents(status.events),
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    default: {
      displayOutput = formatEvents(status.events);
      break;
    }
  }

  return (
    <div className={styles.resultsContent}>
      {formatResultsOutput(displayOutput)}
    </div>
  );
}
