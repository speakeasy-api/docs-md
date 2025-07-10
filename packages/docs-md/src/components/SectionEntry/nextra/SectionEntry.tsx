import type { SectionEntryProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionEntry({ variant, children }: SectionEntryProps) {
  if (variant === "fields") {
    return <div className={styles.fieldEntry}>{children}</div>;
  }

  return <div>{children}</div>;
}
