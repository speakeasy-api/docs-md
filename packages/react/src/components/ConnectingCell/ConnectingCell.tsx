import clsx from "clsx";

import styles from "../ExpandableSection/styles.module.css";
import type { ConnectingCellProps } from "./types.ts";

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
