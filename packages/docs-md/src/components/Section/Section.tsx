import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type { SectionVariant } from "../../renderers/base/base.ts";
import { useChildren, useUniqueChild } from "./hooks.ts";
import styles from "./styles.module.css";

export type SectionProps = PropsWithChildren<{
  variant: SectionVariant;
}>;

export function Section({ children, variant }: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");
  return (
    <div className={clsx(variant !== "breakout" && styles.section)}>
      <div>{titleChild}</div>
      <div
        className={clsx(
          variant === "breakout" && styles.breakout,
          variant === "top-level" && styles.topLevel
        )}
      >
        {contentChildren}
      </div>
    </div>
  );
}
