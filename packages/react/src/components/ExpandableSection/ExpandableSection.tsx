// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { ExpandableSectionContents } from "./components/ExpandableSectionContents.tsx";
import type { ExpandableSectionProps } from "./types.ts";

/**
 * An expandable section is the top-level container that contains all schema
 * rows. There is only ever one expandable section in a given tree (aka they do
 * not nest).
 */
export function ExpandableSection(props: ExpandableSectionProps) {
  return <ExpandableSectionContents {...props} />;
}
