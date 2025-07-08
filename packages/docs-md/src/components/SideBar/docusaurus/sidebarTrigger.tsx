"use client";

import type { PropsWithChildren } from "react";

import { Button } from "../../primitives/docusaurus/Button.tsx";
import styles from "./styles.module.css";

export function DocusaurusSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <Button onClick={onClick} className={styles.sidebarTrigger}>
      {children}
    </Button>
  );
}
