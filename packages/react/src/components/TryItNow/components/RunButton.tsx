"use client";

import type { RunButtonProps } from "../types.ts";
import styles from "./styles.module.css";

export function RunButton({ onClick, disabled, loading }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Run code"
      disabled={disabled || loading}
      className={
        loading ? styles.loading + " " + styles.runButton : styles.runButton
      }
    >
      Run
    </button>
  );
}
