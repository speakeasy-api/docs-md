import styles from "./styles.module.css";
import type { ExpandableTreeTopperProps } from "./types.ts";

/**
 * A component that renders a tree topper, which is a small dot that indicates
 * the start of a new tree. This component lives at the top of an expandable
 * section.
 */
export function ExpandableTreeTopper(_: ExpandableTreeTopperProps) {
  return (
    <div className={styles.treeTopper}>
      <div className={styles.treeTopperDot}></div>
    </div>
  );
}
