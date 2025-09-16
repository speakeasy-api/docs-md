import clsx from "clsx";

import styles from "./styles.module.css";
import type { TabButtonProps } from "./types.ts";

/**
 * The button component used to render a tab in tabbed sections, such as
 * responses.
 */
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
