import clsx from "clsx";

import styles from "./styles.module.css";
import type { SectionContentProps } from "./types.tsx";

export function SectionContent({
  slot,
  borderVariant,
  paddingVariant,
  children,
  id,
}: SectionContentProps) {
  return (
    <div
      className={clsx(
        styles.content,
        borderVariant === "all" && styles.borderAll,
        paddingVariant === "default" && styles.paddingDefault
      )}
      id={id}
      slot={slot}
    >
      {children}
    </div>
  );
}
