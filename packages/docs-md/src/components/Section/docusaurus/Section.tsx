import { Card } from "../../primitives/docusaurus/Card.tsx";
import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({ title, children, id }: SectionProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.header} id={id}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div>{children}</div>
    </Card>
  );
}
