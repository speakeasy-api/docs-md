import clsx from "clsx";

import styles from "./styles.module.css";
import type { ConnectionCellProps } from "./types.ts";

type ExpandableCellProps = Pick<ConnectionCellProps, "bottom" | "left"> & {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ExpandableCell({
  isOpen,
  bottom: bottomConnection,
  left: leftConnection,
  setIsOpen,
}: ExpandableCellProps) {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.expandableCellContainer}>
      {/* Row 1 */}
      <div
        className={styles.expandableTop}
        style={{
          gridRow: "1",
          gridColumn: "1 / span 6",
        }}
      />

      {/* Row 2 */}
      <div
        className={clsx(
          styles.expandableLeft,
          leftConnection === "connected" && styles.horizontalConnected,
          leftConnection === "highlighted" && styles.horizontalHighlighted
        )}
        style={{
          gridRow: "2 / span 2",
          gridColumn: "1",
        }}
      />
      <div
        className={styles.expandableButtonContainer}
        style={{
          gridRow: "2 / span 4",
          gridColumn: "2 / span 4",
        }}
      >
        <button className={styles.expandableButton} onClick={handleClick}>
          <div
            style={{
              transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease-in-out",
              transformOrigin: "center",
            }}
          >
            △
          </div>
        </button>
      </div>
      <div
        className={styles.expandableRight}
        style={{
          gridRow: "2 / span 4",
          gridColumn: "6",
        }}
      />

      {/* Row 3 */}
      <div
        className={styles.expandableLeft}
        style={{ gridRow: "4 / span 2", gridColumn: "1" }}
      />
      {/* Middle cells occupied by button */}
      {/* Right cell occupied by previous row */}

      {/* Row 4 */}
      {/* Lower left cell, responsible for the bottom connection */}
      <div
        className={clsx(
          styles.expandableBottom,
          bottomConnection === "connected" && styles.verticalConnected,
          bottomConnection === "highlighted" && styles.verticalHighlighted
        )}
        style={{
          gridRow: "6",
          gridColumn: "1 / span 3",
        }}
      />
      <div
        className={styles.expandableBottom}
        style={{
          gridRow: "6",
          gridColumn: "4 / span 3",
        }}
      />
    </div>
  );
}
