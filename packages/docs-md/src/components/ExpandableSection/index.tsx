import { DocusaurusExpandableSection } from "./docusaurus.tsx";
import type { ExpandableSectionProps } from "./types.ts";

export const ExpandableSection = {
  Docusaurus: (props: ExpandableSectionProps) => (
    <DocusaurusExpandableSection {...props} />
  ),
};
