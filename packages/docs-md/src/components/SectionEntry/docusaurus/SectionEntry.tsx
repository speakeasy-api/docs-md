import type { SectionEntryProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function DocusaurusSectionEntry({
  variant,
  children,
}: SectionEntryProps) {
  if (variant === "fields") {
    return <div className={styles.fieldEntry}>{children}</div>;
  }

  return <div>{children}</div>;
}
