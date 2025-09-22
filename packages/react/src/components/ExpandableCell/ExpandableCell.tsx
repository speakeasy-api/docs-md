"use client";

import clsx from "clsx";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ExpandableCellIcon as DefaultExpandableCellIcon } from "../ExpandableCellIcon/ExpandableCellIcon.tsx";
import styles from "./styles.module.css";
import type { ExpandableCellProps } from "./types.ts";

/**
 * An Expandable cell is part of a schema row. It is responsible for rendering
 * the expandable button used in the tree-view of the schema. Each row always
 * has either one ExpandableCell or one NonExpandableCell, and are always to the
 * right of the connecting cells.
 *
 * We use an expandable cell any time a breakout/property has children (other
 * breakouts/properties) and/or has front matter (description, examples,
 * default value, etc.)
 *
 * Note: this is a controlled component. The initial open/closed state is set by
 * the compiled MDX code, and its state is managed by
 * src/components/ExpandableSection/components/PrefixCells.tsx
 */
export function ExpandableCell({
  isOpen,
  setIsOpen,
  variant,
  ExpandableCellIcon = DefaultExpandableCellIcon,
}: ExpandableCellProps) {
  return (
    <div className={styles.expandableCellContainer}>
      <div className={styles.expandableButtonContainer}>
        <button
          className={clsx(
            styles.expandableButton,
            variant === "property" && styles.expandableButtonCircle
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ExpandableCellIcon
            className={styles.expandableChevron}
            style={{
              transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          />
        </button>
      </div>
      <div className={styles.expandableConnectionContainer}>
        <div className={styles.expandableConnection}></div>
      </div>
    </div>
  );
}
