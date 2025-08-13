"use client";

import type { PropsWithChildren } from "react";

import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
import styles from "../styles.module.css";

type BreakoutCellProps = PropsWithChildren<{ isOpen: boolean }>;

export function BreakoutCell({ isOpen, children }: BreakoutCellProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");
  return (
    <div className={styles.breakoutCell}>
      <div className={styles.breakoutCellTitle}>{titleChild}</div>
      {isOpen && contentChildren}
    </div>
  );
}
