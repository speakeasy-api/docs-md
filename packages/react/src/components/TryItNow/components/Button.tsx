"use client";

import clsx from "clsx";

import type { ButtonProps } from "../types.ts";
import styles from "./styles.module.css";

export function Button({
  onClick,
  ariaLabel,
  children,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      className={clsx(styles.button, className)}
    >
      {children}
    </button>
  );
}
