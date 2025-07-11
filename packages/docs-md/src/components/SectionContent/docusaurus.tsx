import type { SectionContentProps } from "./common/types.tsx";
import { DocusaurusSectionContent } from "./docusaurus/SectionContent.tsx";

export function SectionContent(props: SectionContentProps) {
  return <DocusaurusSectionContent {...props} />;
}
