"use client";

import { Console, Hook, Unhook } from "console-feed";
import type { ResultsProps } from "../types.ts";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

type LogMessage = {
  method: "log";
  data: string;
  id: string;
};
export function Results({ output, loading }: ResultsProps) {
  const [logs, setLogs] = useState<LogMessage[]>([]);

  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) =>
        setLogs((currLogs) => [...currLogs, log as unknown as LogMessage]),
      false
    );
    return () => {
      Unhook(hookedConsole);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Console
      // @ts-ignore
      logs={output ? logs : []}
      styles={{ LOG_BACKGROUND: "#1e1e1e" }}
      variant="dark"
      logGrouping={false}
    />
  );
}
