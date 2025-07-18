import clsx from "clsx";

import type { SectionContentProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionContent({
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
