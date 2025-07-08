import type { SectionProps } from "./common/types.ts";
import { DocusaurusSection } from "./docusaurus/Section.tsx";

export function Section(props: SectionProps) {
  return <DocusaurusSection {...props} />;
}
