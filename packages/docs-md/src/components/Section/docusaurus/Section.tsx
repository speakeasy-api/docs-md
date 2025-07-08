import { Card } from "../../primitives/docusaurus/Card.tsx";
import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({ title, children, id }: SectionProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.header} id={id}>
        <div className={styles.title}>{title}</div>
      </div>
      <div>{children}</div>
    </Card>
  );
}
