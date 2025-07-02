import { DocusaurusExpandableSection } from "./docusaurus.tsx";
import { NextraExpandableSection } from "./nextra.tsx";
import type { ExpandableSectionProps } from "./types.ts";

export const ExpandableSection = {
  Docusaurus: (props: ExpandableSectionProps) => (
    <DocusaurusExpandableSection {...props} />
  ),
  Nextra: (props: ExpandableSectionProps) => (
    <NextraExpandableSection {...props} />
  ),
};
