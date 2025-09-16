// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

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
