import styles from "./styles.module.css";
import type { DebugPlaceholderProps } from "./types.ts";

/**
 * This component displays a placeholder in the UI representing information
 * that is not supplied in user's OpenAPI spec. It is only shown in debug mode,
 * and is helpful for identifying why a section is not displaying anything
 */
export function DebugPlaceholder({ children }: DebugPlaceholderProps) {
  return <div className={styles.debugPlaceholder}>{children}</div>;
}
