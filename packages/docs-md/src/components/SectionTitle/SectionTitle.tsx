import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type {
  SectionTitleBorderVariant,
  SectionTitlePaddingVariant,
} from "../../renderers/base/base.ts";
import styles from "./styles.module.css";

export type SectionTitleProps = PropsWithChildren<{
  id?: string;
  borderVariant: SectionTitleBorderVariant;
  paddingVariant: SectionTitlePaddingVariant;
  slot: "title";
}>;

export function SectionTitle({
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
