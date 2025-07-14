import clsx from "clsx";

import type { SectionTitleProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function DocusaurusSectionTitle({
  children,
  slot,
  borderVariant,
  paddingVariant,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        styles.title,
        borderVariant === "default" && styles.borderDefault,
        paddingVariant === "default" && styles.paddingDefault
      )}
      slot={slot}
    >
      {children}
    </div>
  );
}
