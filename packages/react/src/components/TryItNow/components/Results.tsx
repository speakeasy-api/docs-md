"use client";

import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import { JSONTree } from "react-json-tree";

import type { ResultsProps } from "../types.ts";
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
};

function formatEvents(events: RuntimeEvents[]): FormattedEvent[] {
  return events
    .map((event): FormattedEvent | undefined => {
      switch (event.type) {
        case "compilation:error": {
          return { prefix: undefined, id: event.id, value: event.error };
        }
        case "execution:log": {
          return {
            prefix: event.level + ": ",
            id: event.id,
            value: event.message,
          };
        }
        case "execution:uncaught-exception": {
          return {
            prefix: "Uncaught Exception: ",
            id: event.id,
            value: event.error,
          };
        }
        case "execution:uncaught-rejection": {
          return {
            prefix: "Uncaught Rejection: ",
            id: event.id,
            value: event.error,
          };
        }
        default: {
          return undefined;
        }
      }
    })
    .filter((event): event is FormattedEvent => event !== undefined);
}

function formatResultsOutput(events: FormattedEvent[]) {
  return events.map(function (event) {
    const { prefix, value, id } = event;

    if (typeof value === "object" || value === undefined) {
      return (
        <pre key={id}>
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
      <pre key={id}>
        {prefix}
        {JSON.stringify(value)}
      </pre>
    );
  });
}

export function Results({ status }: ResultsProps) {
  // First, check if we don't have anything to show
  if (
    status.state === "idle" ||
    (status.state === "compiling" && !status.previousEvents.length)
  ) {
    return null;
  }

  let displayOutput: FormattedEvent[] = [];
  switch (status.state) {
    case "compiling": {
      displayOutput = [
        {
          prefix: undefined,
          value: "Compiling. Previous events:",
          id: "compiling-header",
        },
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    case "compile-error": {
      displayOutput = [
        {
          prefix: undefined,
          value: "Compile Error: ",
          id: "compile-error-header",
        },
        ...formatEvents(status.events),
        {
          prefix: undefined,
          value: "Previous events:",
          id: "previous-events-header",
        },
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
