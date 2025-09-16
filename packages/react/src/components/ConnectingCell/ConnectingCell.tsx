import clsx from "clsx";

import styles from "../ExpandableSection/styles.module.css";
import type { ConnectingCellProps } from "./types.ts";

/**
 * A connecting cell is part of a schema row. It is responsible for rendering
 * the connecting lines used in the tree-view of the schema. Each row always
 * has at least one connecting cell, and the total number of connecting cells
 * equals the level of nesting of the property/breakout.
 *
 * If you do not wish to draw a visual indicator for connecting cells, then this
 * component can still be used to created padding to indicate nesting. Since
 * connecting cells are always stacked one after the other, the number of
 * connecting cells equals the level of nesting, and so all you need is to set
 * a fixed width to get the correct level of nesting.
 */
export function ConnectingCell({
  bottom: bottomConnection,
  top: topConnection,
  right: rightConnection,
}: ConnectingCellProps) {
  return (
    <div className={styles.connectingCellContainer}>
      {/* Upper left cell, responsible for the top connection */}
      <div
        className={clsx(
          styles.connectingCell,
          topConnection === "connected" && styles.verticalConnected
        )}
      />
      {/* Upper right cell, responsible for the right connection */}
      <div
        className={clsx(
          styles.connectingCell,
          rightConnection === "connected" && styles.horizontalConnected
        )}
      />
      {/* Lower left cell, responsible for the bottom connection */}
      <div
        className={clsx(
          styles.connectingCell,
          bottomConnection === "connected" && styles.verticalConnected
        )}
      />
      {/* Lower right cell, not responsible for any connections */}
      <div className={styles.connectingCell} />
    </div>
  );
}
