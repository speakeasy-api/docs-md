import type { SectionEntryProps } from "./common/types.tsx";
import { DocusaurusSectionEntry } from "./docusaurus/SectionEntry.tsx";

export function SectionEntry(props: SectionEntryProps) {
  return <DocusaurusSectionEntry {...props} />;
}
