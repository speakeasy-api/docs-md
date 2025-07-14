import clsx from "clsx";

import type { SectionContentProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function DocusaurusSectionContent({
  slot,
  borderVariant,
  paddingVariant,
  noBorderRadiusOnFirstElement,
  children,
  id,
}: SectionContentProps) {
  return (
    <div
      className={clsx(
        styles.content,
        borderVariant === "all" && styles.borderAll,
        paddingVariant === "default" && styles.paddingDefault,
        noBorderRadiusOnFirstElement && styles.noBorderRadiusOnFirstElement
      )}
      id={id}
      slot={slot}
    >
      {children}
    </div>
  );
}
