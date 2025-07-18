"use client";

import { Section } from "../../Section/docusaurus.tsx";
import { SectionContent } from "../../SectionContent/docusaurus.tsx";
import { SectionTitle } from "../../SectionTitle/docusaurus.tsx";
import { useTabbedChildren } from "../common/hooks.tsx";
import type { TabbedSectionProps } from "../common/types.ts";
import styles from "./styles.module.css";
import { TabButton } from "./TabButton.tsx";

export function DocusaurusTabbedSection({ children }: TabbedSectionProps) {
  const { titleChild, tabChildren, activeChild } = useTabbedChildren({
    children,
    TabButton,
  });

  return (
    <Section contentBorderVariant="default">
      <SectionTitle
        slot="title"
        borderVariant="default"
        paddingVariant="default"
      >
        <div className={styles.titleContainer}>
          <div>{titleChild}</div>
          <div className={styles.tabs}>{tabChildren}</div>
        </div>
      </SectionTitle>
      <SectionContent
        slot="content"
        borderVariant="default"
        paddingVariant="default"
      >
        {activeChild}
      </SectionContent>
    </Section>
  );
}
