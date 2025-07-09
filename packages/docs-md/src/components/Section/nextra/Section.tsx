import { Card } from "../../primitives/nextra/Card.tsx";
import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function NextraSection({ title, children, id }: SectionProps) {
  return (
    <Card>
      <div className={styles.header} id={id}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div>{children}</div>
    </Card>
  );
}
