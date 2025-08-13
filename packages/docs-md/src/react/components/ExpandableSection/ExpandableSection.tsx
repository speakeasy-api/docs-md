// Nextra requires us to jump through some hoops to use client components in MDX
// files. This is because MDX files cannot import files marked with "use
// client", for some reason, but it's perfectly happy to import a server
// component (this file) that then imports a client component.

import type { ExpandableSectionProps } from "./components/ExpandableSectionContents.tsx";
import { ExpandableSectionContents } from "./components/ExpandableSectionContents.tsx";

export function ExpandableSection(props: ExpandableSectionProps) {
  return <ExpandableSectionContents {...props} />;
}
