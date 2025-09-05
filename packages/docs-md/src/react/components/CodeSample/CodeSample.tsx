import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export function CodeSample({ children }: PropsWithChildren) {
  return <div className={styles.codeSampleContainer}>{children}</div>;
}
