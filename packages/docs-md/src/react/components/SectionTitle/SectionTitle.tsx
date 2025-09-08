import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export type SectionTitleProps = PropsWithChildren<{
  id?: string;
  slot: "title";
}>;

export function SectionTitle({ children, slot, id }: SectionTitleProps) {
  return (
    <div id={id} className={styles.title} slot={slot}>
      {children}
    </div>
  );
}
