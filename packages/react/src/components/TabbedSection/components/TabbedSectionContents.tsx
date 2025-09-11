"use client";

// eslint-disable-next-line fast-import/no-restricted-imports
import { Section as DefaultSection } from "../../Section/Section.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { SectionContent as DefaultSectionContent } from "../../SectionContent/SectionContent.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { SectionTitle as DefaultSectionTitle } from "../../SectionTitle/SectionTitle.tsx";
import type { TabbedSectionProps } from "../types.ts";
import { useTabbedChildren } from "./hooks.tsx";
import styles from "./styles.module.css";
import { TabButton } from "./TabButton.tsx";

export function TabbedSectionContents({
  children,
  Section = DefaultSection,
  SectionContent = DefaultSectionContent,
  SectionTitle = DefaultSectionTitle,
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
