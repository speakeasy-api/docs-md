import clsx from "clsx";

import sectionStyles from "../../Section/docusaurus/styles.module.css";
import type { HeaderContainerProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function HeaderContainer({ title, children, id }: HeaderContainerProps) {
  return (
    <div
      className={clsx(
        sectionStyles.header,
        sectionStyles.linedHeader,
        styles.header
      )}
      id={id}
    >
      <h3 className={sectionStyles.title}>{title}</h3>
      <div className={styles.contents}>{children}</div>
    </div>
  );
}
