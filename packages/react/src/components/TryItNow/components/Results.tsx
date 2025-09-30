"use client";

import { Console } from "console-feed";
import type { ResultsProps } from "../types.ts";

export function Results({ output }: ResultsProps) {
  return (
    <Console
      logs={output ?? []}
      styles={{ LOG_BACKGROUND: "#1e1e1e" }}
      variant="dark"
      logGrouping={false}
    />
  );
}
