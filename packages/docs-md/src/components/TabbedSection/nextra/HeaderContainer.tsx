import sectionStyles from "../../Section/nextra/styles.module.css";
import type { HeaderContainerProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function HeaderContainer({ children }: HeaderContainerProps) {
  return (
    <div className={sectionStyles.header}>
      <div className={styles.contents}>{children}</div>
    </div>
  );
}
