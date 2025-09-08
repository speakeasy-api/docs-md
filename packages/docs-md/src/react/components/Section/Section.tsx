import clsx from "clsx";

import { useChildren, useUniqueChild } from "../../util/hooks.ts";
import styles from "./styles.module.css";
import type { SectionProps } from "./types.ts";

export function Section({ children }: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");
  return (
    <div className={clsx(styles.section)}>
      <div>{titleChild}</div>
      <div>{contentChildren}</div>
    </div>
  );
}
