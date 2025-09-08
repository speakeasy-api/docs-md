import styles from "../ExpandableSection/styles.module.css";
import type { NonExpandableCellProps } from "./types.ts";

export function NonExpandableCell(_: NonExpandableCellProps) {
  return <div className={styles.nonExpandableCell}></div>;
}
