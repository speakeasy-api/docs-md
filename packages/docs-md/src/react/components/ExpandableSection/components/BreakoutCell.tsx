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
  return (
    <div className={styles.breakoutCell}>
      <div className={styles.breakoutCellTitle}>{titleChild}</div>
      {isOpen && (
        <>
          {descriptionChildren}
          {examplesChildren}
          {defaultValueChildren}
        </>
      )}
    </div>
  );
}
