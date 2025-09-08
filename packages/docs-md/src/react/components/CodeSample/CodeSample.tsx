import styles from "./styles.module.css";
import type { CodeSampleProps } from "./types.ts";

/**
 * This component displays a code sample, which can be thought of as a read-only
 * version of Try It Now. Notably, it matches the same size and padding as Try
 * It Now.
 *
 * Note: this component does _not_ format text or perform syntax highlighting.
 * Instead, it wraps a triple backtick code block in a property sized container.
 */
export function CodeSample({ children }: CodeSampleProps) {
  return <div className={styles.codeSampleContainer}>{children}</div>;
}
