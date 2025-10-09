import type { CodeSampleTabProps } from "./types.ts";

/**
 * A response tab is a container for a tab's content (aka the response status code and content type), and is always assigned to the `tab`
 * slot.
 *
 * Note: this component contains the _contents_ that we'll put inside of each
 * tab button, but does not contain the button itself. The button itself is
 * created in useTabbedChildren.
 */
export function CodeSampleTab({ children, id, slot }: CodeSampleTabProps) {
  return (
    <div id={id} slot={slot}>
      {children}
    </div>
  );
}
