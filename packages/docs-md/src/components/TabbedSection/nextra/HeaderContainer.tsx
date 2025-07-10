import clsx from "clsx";

import sectionStyles from "../../Section/nextra/styles.module.css";
import type { HeaderContainerProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function HeaderContainer({
  children: [titleChild, ...tabs],
}: HeaderContainerProps) {
  return (
    <div
      className={clsx(
        sectionStyles.header,
        sectionStyles.linedHeader,
        styles.header
      )}
    >
      {titleChild}
      <div className={styles.contents}>{tabs}</div>
    </div>
  );
}
