import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../../types/shared.ts";
import styles from "./styles.module.css";

export type SectionTitleProps = PropsWithChildren<{
  id?: string;
  variant: SectionVariant;
  slot: "title";
}>;

export function SectionTitle({
  children,
  slot,
  variant,
  id,
}: SectionTitleProps) {
  return (
    <div
      id={id}
      className={clsx(styles.title, variant === "top-level" && styles.topLevel)}
      slot={slot}
    >
      {children}
    </div>
  );
}
