"use client";

import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export function DocusaurusSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button onClick={onClick} className={styles.sidebarTrigger}>
      {children}
    </button>
  );
}
