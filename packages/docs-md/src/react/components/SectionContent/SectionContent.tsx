import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export type SectionContentProps = PropsWithChildren<{
  id?: string;
  slot: "content";
}>;

export function SectionContent({ slot, children, id }: SectionContentProps) {
  return (
    <div className={styles.content} id={id} slot={slot}>
      {children}
    </div>
  );
}
