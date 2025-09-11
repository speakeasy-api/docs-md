import clsx from "clsx";

import { useChildren, useUniqueChild } from "../../util/hooks.ts";
import styles from "./styles.module.css";
import type { SectionProps } from "./types.ts";

/**
 * A section is a container for content. It contains the following sections:
 *
 * - Title: assigned to the `title` slot
 * - Content: assigned to the `content` slot
 *
 * Each child represents a semantic part of a section and is assigned to a
 * named slot. These slots allow this container, or any overridden version of it,
 * to layout the children in the desired way.
 */
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
