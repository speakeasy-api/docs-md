"use client";

import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useChildren, useUniqueChild } from "../Section/hooks.ts";
import type { SectionProps } from "../Section/Section.tsx";
import { SectionContent } from "../SectionContent/SectionContent.tsx";
import type { SectionContentProps } from "../SectionContent/types.tsx";
import type { SectionTitleProps } from "../SectionTitle/SectionTitle.tsx";
import { SectionTitle } from "../SectionTitle/SectionTitle.tsx";
import styles from "./styles.module.css";

export type ExpandableSectionProps = PropsWithChildren<{
  id?: string;
}>;

type ExpandableSectionContentProps = ExpandableSectionProps & {
  Section: FC<SectionProps>;
};

export function ExpandableSectionContents({
  id,
  children,
  Section,
}: ExpandableSectionContentProps) {
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
      <button
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
      </button>
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
