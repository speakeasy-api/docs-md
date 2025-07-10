import sectionStyles from "../../Section/nextra/styles.module.css";
import type { HeaderContainerProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function HeaderContainer({ title, children, id }: HeaderContainerProps) {
  return (
    <div className={sectionStyles.header} id={id}>
      <h3 className={sectionStyles.title}>{title}</h3>
      <div className={styles.contents}>{children}</div>
    </div>
  );
}
