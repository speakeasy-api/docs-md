import clsx from "clsx";
import type { PropsWithChildren } from "react";

import type { PillVariant } from "../../../types/shared.ts";
import styles from "./styles.module.css";

type PillProps = PropsWithChildren<{ variant: PillVariant }>;

export function Pill({ variant, children }: PillProps) {
  return <span className={clsx(styles.pill, styles[variant])}>{children}</span>;
}
