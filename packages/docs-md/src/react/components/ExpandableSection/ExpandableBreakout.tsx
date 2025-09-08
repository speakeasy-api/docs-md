import { BreakoutContents } from "./components/BreakoutContents.tsx";
import type { ExpandableBreakoutProps } from "./types.ts";

/**
 * An expandable breakout renders a row in the UI that represents a breakout in
 * a non-object schema, aka a thing with just a name in the header and
 * front-matter, children, etc. in the body.
 */
export function ExpandableBreakout(props: ExpandableBreakoutProps) {
  return <BreakoutContents {...props} />;
}
