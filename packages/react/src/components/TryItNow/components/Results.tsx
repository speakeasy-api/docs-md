"use client";

import type { ResultsProps } from "../types.ts";

export function Results({ status }: ResultsProps) {
  if (
    status.state === "idle" ||
    (status.state === "running" &&
      !status.previousResults &&
      !status.previousError)
  ) {
    return null;
  }

  let displayOutput: string[] = [];
  switch (status.state) {
    case "success":
      displayOutput = status.results.output.map((output) =>
        JSON.stringify(JSON.parse(output), null, 2)
      );
      break;
    case "error":
      if (typeof status.error.output[0] === "string") {
        displayOutput = status.error.output as string[];
      } else {
        displayOutput = (status.error.output as Error[]).map(
          (error) => error.message
        );
      }
      break;
    case "running":
      displayOutput = status.previousResults?.output ?? [];
      break;
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
