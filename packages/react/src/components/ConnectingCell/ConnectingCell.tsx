import clsx from "clsx";

import styles from "./styles.module.css";
import type { ConnectingCellProps } from "./types.ts";

/**
 * A connecting cell is used to display connecting lines in the tree-view of the
 * schema. This cell does two things:
 * 1. It creates padding to indent the content from the expand button
 * 2. It draws connecting lines from the parent to its children, if they exist
 *
 * If you do not wish to draw a visual indicator for connecting cells, then
 * you'll still need to override it, but you can either just have it return a
 * `div` with a fixed width, or you can have it return `null` and set a margin
 * on the content/padding on the parent to create the same effect.
 */
export function ConnectingCell({
  bottom: bottomConnection,
  top: topConnection,
  right: rightConnection,
  children,
}: ConnectingCellProps) {
  if (Array.isArray(children) && !children.length) {
    return (
      <>
        <div className={styles.emptyConnectingCell} />
        {children}
      </>
    );
  }
  return (
    <div className={styles.connectingCellRow}>
      <div className={styles.connectingCellContainer}>
        {/* Upper left cell, responsible for the top connection */}
        <div
          className={clsx(
            styles.upperLeftConnectingCell,
            topConnection === "connected" && styles.verticalConnected
          )}
        />
        {/* Upper right cell, responsible for the right connection */}
        <div
          className={clsx(
            styles.upperRightConnectingCell,
            rightConnection === "connected" && styles.horizontalConnected
          )}
        />
        {/* Lower left cell, responsible for the bottom connection */}
        <div
          className={clsx(
            styles.lowerLeftConnectingCell,
            bottomConnection === "connected" && styles.verticalConnected
          )}
        />
        {/* Lower right cell, not responsible for any connections */}
        <div className={styles.lowerRightConnectingCell} />
      </div>
      <div className={styles.connectingCellContent}>{children}</div>
    </div>
  );
}
