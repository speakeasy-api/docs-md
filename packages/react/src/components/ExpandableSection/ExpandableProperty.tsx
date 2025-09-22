// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { PropertyContents } from "./components/PropertyContents.tsx";
import type {
  ExpandablePropertyBreakoutsProps,
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

/**
 * The title of an expandable property. This is assigned to the `title` slot.
 */
export function ExpandablePropertyTitle({
  children,
  slot,
}: ExpandablePropertyTitleProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The description of an expandable property. This is assigned to the
 * `description` slot.
 */
export function ExpandablePropertyDescription({
  children,
  slot,
}: ExpandablePropertyDescriptionProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The examples of an expandable property. This is assigned to the `examples`
 * slot.
 */
export function ExpandablePropertyExamples({
  children,
  slot,
}: ExpandablePropertyExamplesProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The default value of an expandable property. This is assigned to the
 * `defaultValue` slot.
 */
export function ExpandablePropertyDefaultValue({
  children,
  slot,
}: ExpandablePropertyDefaultValueProps) {
  return <div slot={slot}>{children}</div>;
}

export function ExpandablePropertyBreakouts({
  children,
  slot,
}: ExpandablePropertyBreakoutsProps) {
  return <div slot={slot}>{children}</div>;
}
