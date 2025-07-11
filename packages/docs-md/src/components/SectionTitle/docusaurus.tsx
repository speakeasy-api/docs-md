import type { SectionTitleProps } from "./common/types.tsx";
import { DocusaurusSectionTitle } from "./docusaurus/SectionTitle.tsx";

export function SectionTitle(props: SectionTitleProps) {
  return <DocusaurusSectionTitle {...props} />;
}
