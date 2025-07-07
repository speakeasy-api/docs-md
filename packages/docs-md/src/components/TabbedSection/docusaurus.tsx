import type { TabbedSectionProps } from "./common/types.ts";
import { DocusaurusTabbedSection } from "./docusaurus/TabbedSection.tsx";

export function TabbedSection(props: TabbedSectionProps) {
  return <DocusaurusTabbedSection {...props} />;
}
