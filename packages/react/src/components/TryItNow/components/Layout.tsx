"use client";

import type { LayoutProps } from "../types.ts";
import styles from "./styles.module.css";

/**
 * This holds all of the elements of TryItNow and allows us to control the layout of the elements.
 * It can be replace by a custom layout if needed.
 *
 */
export function Layout({ children }: LayoutProps) {
  return <div className={styles.layout}>{children}</div>;
}
