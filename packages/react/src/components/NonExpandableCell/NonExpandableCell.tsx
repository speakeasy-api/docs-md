import styles from "../ExpandableSection/styles.module.css";
import type { NonExpandableCellProps } from "./types.ts";

/**
 * A non expandable cell is part of a schema row. It is responsible for
 * rendering the non-expandable button used in the tree-view of the schema. A
 * row is considered non-expandable if it a) has no child breakouts or
 * properties _and_ b) has no front matter. NonExpandableCell takes no props.
 *
 * Each row always has either one ExpandableCell or one NonExpandableCell, and
 * are always to the right of the connecting cells.
 */
export function NonExpandableCell(_: NonExpandableCellProps) {
  return <div className={styles.nonExpandableCell}></div>;
}
