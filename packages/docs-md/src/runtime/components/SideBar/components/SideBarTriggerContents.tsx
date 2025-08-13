"use client";

import clsx from "clsx";
import { useAtom } from "jotai";
import type { PropsWithChildren } from "react";
import { useCallback } from "react";

import { sidebarContentAtom } from "../state/atoms.ts";
import styles from "./styles.module.css";

export type SideBarTriggerProps = PropsWithChildren<{
  cta: string;
  title: string;
}>;

export function SideBarTriggerContents({
  cta,
  children,
  title,
}: SideBarTriggerProps) {
  const [, setContent] = useAtom(sidebarContentAtom);
  const onClick = useCallback(
    () => setContent({ title, content: children }),
    [title, children, setContent]
  );
  return (
    <button onClick={onClick} className={clsx(styles.sidebarTrigger)}>
      {cta}
    </button>
  );
}
