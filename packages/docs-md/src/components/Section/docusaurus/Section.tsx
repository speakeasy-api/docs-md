import clsx from "clsx";

import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({
  title,
  children,
  id,
  variant,
}: SectionProps) {
  let heading: React.ReactNode;
  switch (variant) {
    case "fields": {
      heading = (
        <h4 className={clsx(styles.title, styles.titleSmall)}>{title}</h4>
      );
      break;
    }
    case "operation": {
      heading = (
        <h2 className={clsx(styles.title, styles.titleLarge)}>{title}</h2>
      );
      break;
    }
    default: {
      heading = <h3 className={styles.title}>{title}</h3>;
      break;
    }
  }
  return (
    <>
      <div
        className={clsx(
          styles.header,
          variant !== "fields" && styles.linedHeader
        )}
        id={id}
      >
        {heading}
      </div>
      <div
        className={
          variant === "fields" ? styles.linedContainer : styles.container
        }
      >
        {children}
      </div>
    </>
  );
}
