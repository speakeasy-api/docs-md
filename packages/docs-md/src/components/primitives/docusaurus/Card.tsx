import clsx from "clsx";
import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export function Card({
  className,
  id,
  children,
}: PropsWithChildren<{ className?: string; id?: string }>) {
  return (
    <div className={clsx(styles.card, className)} id={id}>
      {children}
    </div>
  );
}
