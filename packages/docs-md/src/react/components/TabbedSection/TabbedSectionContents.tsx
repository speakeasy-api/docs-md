"use client";

import { Section } from "../Section/Section.tsx";
import { SectionContent } from "../SectionContent/SectionContent.tsx";
import type { SectionTabProps } from "../SectionTab/SectionTab.tsx";
import { SectionTitle } from "../SectionTitle/SectionTitle.tsx";
import { useTabbedChildren } from "./hooks.tsx";
import styles from "./styles.module.css";
import { TabButton } from "./TabButton.tsx";

export type TabbedSectionProps = {
  children: React.ReactElement<SectionTabProps>[];
};

export function TabbedSectionContents({ children }: TabbedSectionProps) {
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
