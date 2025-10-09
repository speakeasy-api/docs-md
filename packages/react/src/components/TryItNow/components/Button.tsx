"use client";

import type { ButtonProps } from "../types.ts";
import styles from "./styles.module.css";

export function Button({ onClick, ariaLabel, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      className={styles.button}
    >
      {children}
    </button>
  );
}
