import { Card } from "../../primitives/nextra/Card.tsx";
import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function NextraSection({ children: [title, content] }: SectionProps) {
  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div>{content}</div>
    </Card>
  );
}
