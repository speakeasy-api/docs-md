import clsx from "clsx";

import type { TabButtonProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function TabButton({
  title,
  tooltip,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={clsx(
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive
      )}
      style={{
        fontWeight: isActive ? "bold" : "normal",
      }}
    >
      {title}
    </button>
  );
}
