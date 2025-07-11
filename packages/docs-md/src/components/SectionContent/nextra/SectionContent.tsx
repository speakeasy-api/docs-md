import type { SectionContentProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionContent({
  variant,
  children,
}: SectionContentProps) {
  if (variant === "fields") {
    return <div className={styles.contents}>{children}</div>;
  }
  return <div>{children}</div>;
}
