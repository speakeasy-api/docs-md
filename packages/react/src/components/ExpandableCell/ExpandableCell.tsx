"use client";

import clsx from "clsx";

import { ExpandableCellIcon as DefaultExpandableCellIcon } from "../ExpandableCellIcon/ExpandableCellIcon.tsx";
import styles from "../ExpandableSection/styles.module.css";
import type { ExpandableCellProps } from "./types.ts";

export function ExpandableCell({
  isOpen,
  setIsOpen,
  bottomConnection,
  variant,
  ExpandableCellIcon = DefaultExpandableCellIcon,
}: ExpandableCellProps) {
  return (
    <div className={styles.expandableCellContainer}>
      <div className={styles.expandableButtonContainer}>
        <button
          className={clsx(
            styles.expandableButton,
            variant === "circle" && styles.expandableButtonCircle
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ExpandableCellIcon
            className={styles.expandableChevron}
            style={{
              transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </button>
      </div>
      <div className={styles.expandableConnectionContainer}>
        <div
          className={clsx(
            styles.expandableConnection,
            isOpen &&
              bottomConnection === "connected" &&
              styles.verticalConnected
          )}
        ></div>
        <div className={styles.expandableConnection}></div>
      </div>
    </div>
  );
}
