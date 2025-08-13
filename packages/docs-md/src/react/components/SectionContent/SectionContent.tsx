import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../../types/shared.ts";
import styles from "./styles.module.css";

export type SectionContentProps = PropsWithChildren<{
  id?: string;
  slot: "content";
  variant: SectionVariant;
}>;

export function SectionContent({
  slot,
  variant,
  children,
  id,
}: SectionContentProps) {
  return (
    <div
      className={clsx(
        styles.content,
        variant === "top-level" && styles.topLevel
      )}
      id={id}
      slot={slot}
    >
      {children}
    </div>
  );
}
