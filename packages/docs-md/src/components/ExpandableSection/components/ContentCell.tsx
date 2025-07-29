"use client";

import type { PropsWithChildren } from "react";

import { useChildren, useUniqueChild } from "../../Section/hooks.ts";
import styles from "../styles.module.css";

type ContentCellProps = PropsWithChildren<{ isOpen: boolean }>;

export function ContentCell({ isOpen, children }: ContentCellProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");
  return (
    <div className={styles.contentCell}>
      <div className={styles.contentCellTitle}>{titleChild}</div>
      {isOpen && (
        <div className={styles.contentCellContent}>{contentChildren}</div>
      )}
    </div>
  );
}
