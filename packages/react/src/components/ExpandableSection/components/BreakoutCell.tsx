"use client";

import type { PropsWithChildren } from "react";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
import styles from "../styles.module.css";

type BreakoutCellProps = PropsWithChildren<{ isOpen: boolean }>;

export function BreakoutCell({ isOpen, children }: BreakoutCellProps) {
  const titleChild = useUniqueChild(children, "title");
  const descriptionChildren = useChildren(children, "description");
  const examplesChildren = useChildren(children, "examples");
  const defaultValueChildren = useChildren(children, "defaultValue");
  const embedChildren = useChildren(children, "embed");
  return (
    <div className={styles.breakoutCell}>
      <div className={styles.breakoutCellTitle}>{titleChild}</div>
      {isOpen && (
        <div className={styles.breakoutCellContent}>
          {descriptionChildren}
          {examplesChildren}
          {defaultValueChildren}
          {embedChildren}
        </div>
      )}
    </div>
  );
}
