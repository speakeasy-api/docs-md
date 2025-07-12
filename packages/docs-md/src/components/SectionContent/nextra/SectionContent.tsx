import clsx from "clsx";

import type { SectionContentProps } from "../common/types.tsx";
import styles from "./styles.module.css";

export function NextraSectionContent({
  borderVariant,
  children,
}: SectionContentProps) {
  const className = clsx(
    styles.contents,
    borderVariant === "all" && styles.all
  );
  return <div className={className}>{children}</div>;
}
