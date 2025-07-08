import clsx from "clsx";
import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export function Card({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx(styles.card, className)}>{children}</div>;
}
