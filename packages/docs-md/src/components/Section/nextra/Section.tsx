import type { SectionProps } from "../common/types.ts";
import { useChildren, useUniqueChild } from "../hooks.ts";
import styles from "./styles.module.css";

export function NextraSection({ children }: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");

  return (
    <div className={styles.section}>
      {/* Wrap these in divs to isolate CSS to make sure that :first-child in
          content is applied to the first content child, not the title */}
      <div>{titleChild}</div>
      <div>{contentChildren}</div>
    </div>
  );
}
