import clsx from "clsx";

import styles from "./styles.module.css";
import type { PillProps } from "./types.ts";

export function Pill({ variant, children }: PillProps) {
  return <span className={clsx(styles.pill, styles[variant])}>{children}</span>;
}
