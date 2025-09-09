import { PropertyContents } from "./components/PropertyContents.tsx";
import type {
  ExpandablePropertyDefaultValueProps,
  ExpandablePropertyDescriptionProps,
  ExpandablePropertyExamplesProps,
  ExpandablePropertyProps,
  ExpandablePropertyTitleProps,
} from "./types.ts";

/**
 * An expandable property renders a row in the UI that represents a property in
 * an object schema, aka a thing with a name, type, and annotations in the header
 * and front-matter, children, etc. in the body.
 */
export function ExpandableProperty(props: ExpandablePropertyProps) {
  return <PropertyContents {...props} />;
}

export function ExpandablePropertyTitle({
  children,
  slot,
}: ExpandablePropertyTitleProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandablePropertyDescription({
  children,
  slot,
}: ExpandablePropertyDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandablePropertyExamples({
  children,
  slot,
}: ExpandablePropertyExamplesProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandablePropertyDefaultValue({
  children,
  slot,
}: ExpandablePropertyDefaultValueProps) {
  return <div slot={slot}>{children}</div>;
}
