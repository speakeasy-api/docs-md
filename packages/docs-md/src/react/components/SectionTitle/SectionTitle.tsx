import styles from "./styles.module.css";
import type { SectionTitleProps } from "./types.ts";

export function SectionTitle({ children, slot, id }: SectionTitleProps) {
  return (
    <div id={id} className={styles.title} slot={slot}>
      {children}
    </div>
  );
}
