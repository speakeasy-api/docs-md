import styles from "./styles.module.css";
import type { CodeProps } from "./types.ts";

/**
 * This component displays code in a styled pre+code tag. This component is used
 * in lieu of triple backticks to allow HTML tags to be used in the code block,
 * notably anchor tags. Triple backticks escape HTML tags, preventing them from
 * working.
 *
 * This component is primarily used to display type signatures, which includes
 * anchor tags that link to breakouts.
 */
export function Code({ text }: CodeProps) {
  return (
    <pre className={styles.pre}>
      <code
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </pre>
  );
}
