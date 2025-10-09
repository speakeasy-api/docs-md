"use client";

import { useRef, useState } from "react";

import { useChildren } from "../../../util/hooks.ts";
import type { LayoutProps } from "../types.ts";
import styles from "./styles.module.css";

/**
 * This holds all of the elements of TryItNow and allows us to control the layout of the elements.
 * It can be replace by a custom layout if needed.
 *
 */
export function Layout({ children, status }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "results">("editor");
  const editorChild = useChildren(children, "editor");
  const runButtonChild = useChildren(children, "runButton");
  const resultsChild = useChildren(children, "results");

  const prevStateRef = useRef(status.state);

  // Switch to results tab when status changes from idle to non-idle (only once)
  if (prevStateRef.current === "idle" && status.state !== "idle") {
    prevStateRef.current = status.state;
    if (activeTab === "editor") {
      setActiveTab("results");
    }
  } else if (status.state !== prevStateRef.current) {
    prevStateRef.current = status.state;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tab} ${activeTab === "editor" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
        <button
          className={`${styles.tab} ${activeTab === "results" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("results")}
        >
          Output
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "editor" && (
          <div className={styles.editorContainer}>
            {editorChild}
            {runButtonChild}
          </div>
        )}

        {activeTab === "results" && resultsChild}
      </div>
    </div>
  );
}
