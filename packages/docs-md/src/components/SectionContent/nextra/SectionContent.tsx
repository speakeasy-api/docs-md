import clsx from "clsx";

import type { SectionContentProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionContent({
  slot,
  borderVariant,
  paddingVariant,
  noBorderRadiusOnFirstElement,
  children,
}: SectionContentProps) {
  return (
    <div
      className={clsx(
        styles.content,
        borderVariant === "all" && styles.borderAll,
        paddingVariant === "default" && styles.paddingDefault,
        noBorderRadiusOnFirstElement && styles.noBorderRadiusOnFirstElement
      )}
      slot={slot}
    >
      {children}
    </div>
  );
}
