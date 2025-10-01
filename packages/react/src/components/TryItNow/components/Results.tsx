"use client";

import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";

import type { ResultsProps } from "../types.ts";

function formatEvents(events: RuntimeEvents[]) {
  return events
    .map((event) => {
      switch (event.type) {
        case "compilation:error": {
          return String(event.error);
        }
        case "execution:log": {
          return event.level + ": " + event.message;
        }
        case "execution:uncaught-exception": {
          return "Uncaught Exception: " + String(event.error);
        }
        case "execution:uncaught-rejection": {
          return "Uncaught Rejection: " + String(event.error);
        }
        default: {
          return undefined;
        }
      }
    })
    .filter((event) => event !== undefined);
}

export function Results({ status }: ResultsProps) {
  // First, check if we don't have anything to show
  if (
    status.state === "idle" ||
    (status.state === "compiling" && !status.previousEvents.length)
  ) {
    return null;
  }

  let displayOutput: string[] = [];
  switch (status.state) {
    case "compiling": {
      displayOutput = [
        "Compiling. Previous events:",
        ...formatEvents(status.previousEvents),
      ];
      break;
    }
    case "compile-error": {
      displayOutput = [
        "Compile Error: ",
        ...formatEvents(status.events),
        "Previous events:",
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
    <div>
      <pre>
        {displayOutput.length > 1
          ? JSON.stringify(displayOutput, null, 2)
          : displayOutput[0]}
      </pre>
    </div>
  );
}
