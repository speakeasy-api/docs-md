"use client";

import { Section } from "../Section/Section.tsx";
import type { ExpandableSectionProps } from "./ExpandableSectionContents.tsx";
import { ExpandableSectionContents } from "./ExpandableSectionContents.tsx";

export function ExpandableSectionWrapper(props: ExpandableSectionProps) {
  return <ExpandableSectionContents Section={Section} {...props} />;
}
