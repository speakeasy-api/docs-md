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
