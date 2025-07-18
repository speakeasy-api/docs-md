"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "../../primitives/nextra/Button.tsx";
import { useChildren, useUniqueChild } from "../../Section/hooks.ts";
import { Section } from "../../Section/nextra.tsx";
import type { SectionContentProps } from "../../SectionContent/common/types.tsx";
import { SectionContent } from "../../SectionContent/nextra.tsx";
import type { SectionTitleProps } from "../../SectionTitle/common/types.tsx";
import { SectionTitle } from "../../SectionTitle/nextra.tsx";
import type { ExpandableSectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

export function NextraExpandableSection({
  id,
  children,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((prev) => !prev), []);

  // Open section when targeted by URL fragment, which happens when the user
  // clicks on a link in an inline type signature
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === id) {
        setIsOpen(true);
      }
    };

    // Check initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [id]);

  const titleChild = useUniqueChild<SectionTitleProps>(children, "title");
  const contentChildren = useChildren<SectionContentProps>(children, "content");

  const titleElement = useMemo(
    () => (
      <Button
        onClick={onClick}
        className={clsx(styles.button, isOpen && styles.buttonOpen)}
      >
        <div className={styles.title}>{titleChild}</div>
        <div
          style={{
            transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.2s ease-in-out",
            transformOrigin: "center",
          }}
        >
          △
        </div>
      </Button>
    ),
    [onClick, isOpen, titleChild]
  );

  // TODO: animate height when expanding closing. Requires knowing the height up
  // front though it seems.

  if (!isOpen) {
    return (
      <Section contentBorderVariant="default">
        <SectionTitle
          id={id}
          slot="title"
          borderVariant="none"
          paddingVariant="none"
        >
          {titleElement}
        </SectionTitle>
        <SectionContent
          slot="content"
          borderVariant="default"
          paddingVariant="none"
        />
      </Section>
    );
  }

  return (
    <Section contentBorderVariant="all" noTopBorderRadius>
      <SectionTitle
        id={id}
        slot="title"
        borderVariant="none"
        paddingVariant="none"
      >
        {titleElement}
      </SectionTitle>
      <SectionContent
        slot="content"
        borderVariant="all"
        paddingVariant="default"
      >
        {contentChildren}
      </SectionContent>
    </Section>
  );
}
