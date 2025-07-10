import clsx from "clsx";

import type { PillProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusPill({ variant, children }: PillProps) {
  return <span className={clsx(styles.pill, styles[variant])}>{children}</span>;
}
