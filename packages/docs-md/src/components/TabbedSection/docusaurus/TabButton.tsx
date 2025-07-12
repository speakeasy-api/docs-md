import clsx from "clsx";

import type { TabButtonProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function TabButton({ children, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive
      )}
      style={{
        fontWeight: isActive ? "bold" : "normal",
      }}
    >
      {children}
    </button>
  );
}
