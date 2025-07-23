// Nextra requires us to jump through some hoops to use client components in MDX
// files. This is because MDX files cannot import files marked with "use
// client", for some reason, but it's perfectly happy to import a server
// component (this file) that then imports a client component. But also, we
// can't pass function components as props to the client component from the
// server component, so we create a wrapper client component that only exists to
// pass function components to the real component.

import type { ExpandableSectionProps } from "./ExpandableSectionContents.tsx";
import { ExpandableSectionWrapper } from "./ExpandableSectionWrapper.tsx";

export function ExpandableSection(props: ExpandableSectionProps) {
  return <ExpandableSectionWrapper {...props} />;
}
