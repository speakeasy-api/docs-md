import type { PropsWithChildren } from "react";

import styles from "./styles.module.css";

export function DebugPlaceholder({ children }: PropsWithChildren) {
  return <div className={styles.debugPlacholder}>{children}</div>;
}
