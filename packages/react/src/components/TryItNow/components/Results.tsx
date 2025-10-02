"use client";

import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import { JSONTree } from "react-json-tree";

import type { ResultsProps } from "../types.ts";
import styles from "./styles.module.css";

type FormattedEvent = {
  prefix?: string;
  value: unknown;
};

function formatEvents(events: RuntimeEvents[]): FormattedEvent[] {
  return events
    .map((event): FormattedEvent | undefined => {
      switch (event.type) {
        case "compilation:error": {
          return { prefix: undefined, value: event.error };
        }
        case "execution:log": {
          return { prefix: event.level + ": ", value: event.message };
        }
        case "execution:uncaught-exception": {
          return { prefix: "Uncaught Exception: ", value: event.error };
        }
        case "execution:uncaught-rejection": {
          return { prefix: "Uncaught Rejection: ", value: event.error };
        }
        default: {
          return undefined;
        }
      }
    })
    .filter((event): event is FormattedEvent => event !== undefined);
}

function formatResutsOutput(events: FormattedEvent[]) {
  return events.map(function (event, index) {
    const { prefix, value } = event;
    // Handle null/undefined/false values
    if (value === null || value === undefined || value === false) {
      return (
        <pre key={index}>
          {prefix}
          {JSON.stringify(value)}
        </pre>
      );
    }

    // Handle strings
    if (typeof value === "string") {
      return (
        <pre key={index}>
          {prefix}
          {value}
        </pre>
      );
    }

    // Handle numbers and booleans
    if (typeof value === "number" || typeof value === "boolean") {
      return (
        <pre key={index}>
          {prefix}
          {String(value)}
        </pre>
      );
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <pre key={index}>
          {prefix}
          <JSONTree data={value} />
        </pre>
      );
    }

    // Handle objects
    if (typeof value === "object") {
      return (
        <pre key={index}>
          {prefix}
          <JSONTree data={value} />
        </pre>
      );
    }

    // Fallback for other types
    return (
      <pre key={index}>
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
        { prefix: undefined, value: "Compiling. Previous events:" },
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    case "compile-error": {
      displayOutput = [
        { prefix: undefined, value: "Compile Error: " },
        ...formatEvents(status.events),
        { prefix: undefined, value: "Previous events:" },
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    default: {
      displayOutput = formatEvents(status.events);
      break;
    }
  }

  return <div>{formatResutsOutput(displayOutput)}</div>;
}
