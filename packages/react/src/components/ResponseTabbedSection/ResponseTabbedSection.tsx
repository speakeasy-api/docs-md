"use client";

import { useTabbedChildren } from "../../util/clientHooks.tsx";
import { Section } from "../Section/Section.tsx";
import { SectionContent } from "../SectionContent/SectionContent.tsx";
import { SectionTitle } from "../SectionTitle/SectionTitle.tsx";
import { TabButton } from "../TabButton/TabButton.tsx";
import styles from "./styles.module.css";
import type { ResponseTabbedSectionProps } from "./types.ts";

/**
 * This component represents an operation response section with tabs for
 * different responses codes and content types. It is like an extended version
 * of a standard Section component. In addition to taking in a single `title`
 * slotted child and a set of `content` slotted children, it also takes in a set
 * of `tab` slotted children.
 *
 * There is always a one-to-one mapping between the `tab` and `content` slotted
 * children. Each tab and child are linked together via the `id` prop.
 */
export function ResponseTabbedSection({
  children,
}: ResponseTabbedSectionProps) {
  const { titleChild, tabChildren, activeChild } = useTabbedChildren({
    children,
    TabButton,
  });

  return (
    <Section>
      <SectionTitle slot="title">
        <div className={styles.titleContainer}>
          <div>{titleChild}</div>
          <div className={styles.tabs}>{tabChildren}</div>
        </div>
      </SectionTitle>
      <SectionContent slot="content">{activeChild}</SectionContent>
    </Section>
  );
}
