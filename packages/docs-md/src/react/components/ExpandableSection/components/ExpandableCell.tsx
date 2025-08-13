"use client";

import clsx from "clsx";

import styles from "../styles.module.css";
import { ChevronIcon } from "./ChevronIcon.tsx";

type ExpandableCellProps = {
  isOpen: boolean;
  bottomConnection: "connected" | "highlighted" | "none";
  setIsOpen: (isOpen: boolean) => void;
  variant: "circle" | "square";
};

export function ExpandableCell({
  isOpen,
  setIsOpen,
  bottomConnection,
  variant,
}: ExpandableCellProps) {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.expandableCellContainer}>
      <div className={styles.expandableButtonContainer}>
        <button
          className={clsx(
            styles.expandableButton,
            variant === "circle" && styles.expandableButtonCircle
          )}
          onClick={handleClick}
        >
          <ChevronIcon
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
              styles.verticalConnected,
            isOpen &&
              bottomConnection === "highlighted" &&
              styles.verticalHighlighted
          )}
        ></div>
        <div className={styles.expandableConnection}></div>
      </div>
    </div>
  );
}
