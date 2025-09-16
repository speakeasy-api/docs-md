"use client";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { Section as DefaultSection } from "../Section/Section.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { SectionContent as DefaultSectionContent } from "../SectionContent/SectionContent.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { SectionTitle as DefaultSectionTitle } from "../SectionTitle/SectionTitle.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { TabButton as DefaultTabButton } from "../TabButton/TabButton.tsx";
import { useTabbedChildren } from "./hooks.tsx";
import styles from "./styles.module.css";
import type { TabbedSectionProps } from "./types.ts";

export function TabbedSectionContents({
  children,
  Section = DefaultSection,
  SectionContent = DefaultSectionContent,
  SectionTitle = DefaultSectionTitle,
  TabButton = DefaultTabButton,
}: TabbedSectionProps) {
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
