"use client";

import { Console } from "console-feed";
import type { ResultsProps } from "../types.ts";
import styles from "./styles.module.css";

export function Results({ output, loading }: ResultsProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Console
      logs={output ?? []}
      styles={{ LOG_BACKGROUND: "#1e1e1e" }}
      variant="dark"
      logGrouping={false}
    />
  );
}
