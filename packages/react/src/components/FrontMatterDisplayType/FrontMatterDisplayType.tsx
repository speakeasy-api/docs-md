// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { FrontMatterDisplayTypeContents } from "./FontMatterDisplayTypeContents.tsx";
import type { FrontMatterDisplayTypeProps } from "./types.ts";

/**
 * This components displays the type signature of a top-level section. It is
 * very similar to an expandable property's type signature, except that we don't
 * have a property name or annotations to display. This difference makes reusing
 * the expandable property component non-ideal, because that component is
 * already quite complicated, and would become even more so.
 */
export function FrontMatterDisplayType(props: FrontMatterDisplayTypeProps) {
  return <FrontMatterDisplayTypeContents {...props} />;
}
