"use client";

import type { RunButtonProps } from "../types.ts";
import styles from "./styles.module.css";

export function RunButton({ onClick }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Run code"
      className={styles.runButton}
    >
      Run
    </button>
  );
}
