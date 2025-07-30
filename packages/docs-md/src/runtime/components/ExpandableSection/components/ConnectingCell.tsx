import clsx from "clsx";

import styles from "../styles.module.css";
import type { Connection } from "../types.ts";

export function ConnectingCell({
  bottom: bottomConnection,
  top: topConnection,
  right: rightConnection,
}: Pick<Connection, "bottom" | "top" | "right">) {
  return (
    <div className={styles.connectingCellContainer}>
      {/* Upper left cell, responsible for the top connection */}
      <div
        className={clsx(
          styles.connectingCell,
          topConnection === "connected" && styles.verticalConnected,
          topConnection === "highlighted" && styles.verticalHighlighted
        )}
      />
      {/* Upper right cell, responsible for the right connection */}
      <div
        className={clsx(
          styles.connectingCell,
          rightConnection === "connected" && styles.horizontalConnected,
          rightConnection === "highlighted" && styles.horizontalHighlighted
        )}
      />
      {/* Lower left cell, responsible for the bottom connection */}
      <div
        className={clsx(
          styles.connectingCell,
          bottomConnection === "connected" && styles.verticalConnected,
          bottomConnection === "highlighted" && styles.verticalHighlighted
        )}
      />
      {/* Lower right cell, not responsible for any connections */}
      <div className={styles.connectingCell} />
    </div>
  );
}
