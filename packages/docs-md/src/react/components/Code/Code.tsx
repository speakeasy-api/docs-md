import styles from "./styles.module.css";

type CodeProps = {
  text: string;
};

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
