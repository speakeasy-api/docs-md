import type { ExpandableSectionProps } from "./common/types.ts";
import { DocusaurusExpandableSection } from "./docusaurus/ExpandableSection.tsx";

export function ExpandableSection(props: ExpandableSectionProps) {
  return <DocusaurusExpandableSection {...props} />;
}
