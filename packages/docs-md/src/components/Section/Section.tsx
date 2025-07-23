import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type { SectionContentBorderVariant } from "../../renderers/base/base.ts";
import { useChildren, useUniqueChild } from "./hooks.ts";
import styles from "./styles.module.css";

export type SectionProps = PropsWithChildren<{
  contentBorderVariant: SectionContentBorderVariant;

  // Internal property used by ExpandableSection
  noTopBorderRadius?: boolean;
}>;

export function Section({
  children,
  contentBorderVariant,
  noTopBorderRadius,
}: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");
  return (
    <div className={styles.section}>
      <div>{titleChild}</div>
      <div
        className={clsx(
          contentBorderVariant === "all" && styles.contentBorderAll,
          noTopBorderRadius && styles.noTopBorderRadius
        )}
      >
        {contentChildren}
      </div>
    </div>
  );
}
