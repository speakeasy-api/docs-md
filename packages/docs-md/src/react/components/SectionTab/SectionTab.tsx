import type { SectionTabProps } from "./types.ts";

/**
 * A section tab is a container for a tab, and is always assigned to the `tab`
 * slot.
 *
 * Note: this component contains the _contents_ that we'll put inside of each
 * tab button, but does not contain the button itself. The button itself is
 * created in useTabbedChildren.
 */
export function SectionTab({ children, id, slot }: SectionTabProps) {
  return (
    <div id={id} slot={slot}>
      {children}
    </div>
  );
}
