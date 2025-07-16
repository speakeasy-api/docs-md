import type { CodeProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusCode({ text }: CodeProps) {
  return (
    <pre className={styles.pre}>
      <code
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </pre>
  );
}
