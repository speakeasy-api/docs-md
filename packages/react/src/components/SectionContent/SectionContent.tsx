import styles from "./styles.module.css";
import type { SectionContentProps } from "./types.ts";

/**
 * A section content is a container for content, and is always assigned to the
 * `content` slot. Mostly this is used to reset layout related styles that
 * various documentation frameworks inject into their content, so that we can
 * have better control over spacing.
 */
export function SectionContent({ slot, children, id }: SectionContentProps) {
  return (
    <div className={styles.content} id={id} slot={slot}>
      {children}
    </div>
  );
}
