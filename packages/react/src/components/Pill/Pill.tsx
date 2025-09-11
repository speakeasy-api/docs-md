import clsx from "clsx";

import styles from "./styles.module.css";
import type { PillProps } from "./types.ts";

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
export function Pill({ variant, children }: PillProps) {
  return <span className={clsx(styles.pill, styles[variant])}>{children}</span>;
}
