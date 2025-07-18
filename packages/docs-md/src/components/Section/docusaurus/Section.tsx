import clsx from "clsx";

import type { SectionProps } from "../common/types.ts";
import { useChildren, useUniqueChild } from "../hooks.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({
  children,
  contentBorderVariant,
  noTopBorderRadius,
}: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");

  if (noTopBorderRadius !== undefined) {
    console.log("noTopBorderRadius", noTopBorderRadius);
  }

  return (
    <div className={styles.section}>
      <div>{titleChild}</div>
      <div
        className={clsx(
          styles.content,
          contentBorderVariant === "all" && styles.contentBorderAll,
          noTopBorderRadius && styles.noTopBorderRadius
        )}
      >
        {contentChildren}
      </div>
    </div>
  );
}
