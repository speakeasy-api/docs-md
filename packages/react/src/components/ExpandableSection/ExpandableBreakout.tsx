import { BreakoutContents } from "./components/BreakoutContents.tsx";
import type {
  ExpandableBreakoutDefaultValueProps,
  ExpandableBreakoutDescriptionProps,
  ExpandableBreakoutExamplesProps,
  ExpandableBreakoutProps,
  ExpandableBreakoutTitleProps,
} from "./types.ts";

/**
 * An expandable breakout renders a row in the UI that represents a breakout in
 * a non-object schema, aka a thing with just a name in the header and
 * front-matter, children, etc. in the body.
 */
export function ExpandableBreakout(props: ExpandableBreakoutProps) {
  return <BreakoutContents {...props} />;
}

export function ExpandableBreakoutTitle({
  children,
  slot,
}: ExpandableBreakoutTitleProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandableBreakoutDescription({
  children,
  slot,
}: ExpandableBreakoutDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandableBreakoutExamples({
  children,
  slot,
}: ExpandableBreakoutExamplesProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandableBreakoutDefaultValue({
  children,
  slot,
}: ExpandableBreakoutDefaultValueProps) {
  return <div slot={slot}>{children}</div>;
}
