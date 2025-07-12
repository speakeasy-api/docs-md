import { SectionContent } from "../../SectionContent/docusaurus.tsx";
import { SectionTitle } from "../../SectionTitle/docusaurus.tsx";
import type { SectionProps } from "../common/types.ts";
import { useContentChildren, useTitleChild } from "../hooks.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({ children }: SectionProps) {
  const titleChild = useTitleChild(children, SectionTitle);
  const contentChildren = useContentChildren(children, SectionContent);

  return (
    <div className={styles.section}>
      {/* Wrap these in divs to isolate CSS to make sure that :first-child in
          content is applied to the first content child, not the title */}
      <div>{titleChild}</div>
      <div>{contentChildren}</div>
    </div>
  );
}
