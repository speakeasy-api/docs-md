import clsx from "clsx";

import type { SectionTitleProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionTitle({
  children,
  slot,
  borderVariant,
  paddingVariant,
  id,
}: SectionTitleProps) {
  return (
    <div
      id={id}
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
