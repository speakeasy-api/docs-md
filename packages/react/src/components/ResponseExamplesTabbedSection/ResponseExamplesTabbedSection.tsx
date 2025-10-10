"use client";

import { useTabbedChildren } from "../../util/clientHooks.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { Section as DefaultSection } from "../Section/Section.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { SectionContent as DefaultSectionContent } from "../SectionContent/SectionContent.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { SectionTitle as DefaultSectionTitle } from "../SectionTitle/SectionTitle.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { TabButton as DefaultTabButton } from "../TabButton/TabButton.tsx";
import styles from "./styles.module.css";
import type { ResponseExamplesTabbedSectionProps } from "./types.ts";

/**
 * This component represents examples for an operation's response with tabs for
 * different responses codes and content types. It is like an extended version
 * of a standard Section component. In addition to taking in a single `title`
 * slotted child and a set of `content` slotted children, it also takes in a set
 * of `tab` slotted children.
 *
 * There is always a one-to-one mapping between the `tab` and `content` slotted
 * children. Each tab and child are linked together via the `id` prop.
 */
export function ResponseExamplesTabbedSection({
  children,
  Section = DefaultSection,
  SectionContent = DefaultSectionContent,
  SectionTitle = DefaultSectionTitle,
  TabButton = DefaultTabButton,
}: ResponseExamplesTabbedSectionProps) {
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
