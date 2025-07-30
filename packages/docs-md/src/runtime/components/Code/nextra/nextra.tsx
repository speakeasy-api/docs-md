import type { CodeProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function NextraCode({ text }: CodeProps) {
  return (
    <pre className={styles.pre}>
      <code
        className="nextra-code"
        dangerouslySetInnerHTML={{
          __html: text
            .split("\n")
            // Nextra code blocks do this weird thing where it wraps each line in
            // _two_ spans with it's code blocks, so we mimic that behavior here
            .map((line) => `<span><span>${line}</span></span>`)
            .join("\n"),
        }}
      ></code>
    </pre>
  );
}
