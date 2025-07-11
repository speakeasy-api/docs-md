import clsx from "clsx";

import { SectionContent } from "../../SectionContent/docusaurus.tsx";
import { SectionTitle } from "../../SectionTitle/docusaurus.tsx";
import type { SectionProps } from "../common/types.ts";
import { useContentChildren, useTitleChild } from "../hooks.ts";
import styles from "./styles.module.css";

export function DocusaurusSection({
  children,
  variant,
  className,
}: SectionProps) {
  const titleChild = useTitleChild(children, SectionTitle);
  const contentChildren = useContentChildren(children, SectionContent);

  return (
    <>
      <div
        className={clsx(
          styles.header,
          variant !== "fields" && styles.linedHeader,
          className
        )}
      >
        {titleChild}
      </div>
      <div
        className={
          variant === "fields" ? styles.linedContainer : styles.container
        }
      >
        {contentChildren}
      </div>
    </>
  );
}

DocusaurusSection.displayName = "DocusaurusSection";
