import sectionStyles from "../../Section/docusaurus/styles.module.css";
import type { HeaderContainerProps } from "../common/types.ts";

export function HeaderContainer({ title, children }: HeaderContainerProps) {
  return (
    <div className={sectionStyles.header}>
      <div className={sectionStyles.title}>{title}</div>
      <div style={{ display: "flex", gap: "0.5rem" }}>{children}</div>
    </div>
  );
}
