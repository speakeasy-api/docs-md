import clsx from "clsx";

import type { SectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({
  children: [title, content],
  variant,
  className,
}: SectionProps) {
  return (
    <>
      <div
        className={clsx(
          styles.header,
          variant !== "fields" && styles.linedHeader,
          className
        )}
      >
        {title}
      </div>
      <div
        className={
          variant === "fields" ? styles.linedContainer : styles.container
        }
      >
        {content}
      </div>
    </>
  );
}
