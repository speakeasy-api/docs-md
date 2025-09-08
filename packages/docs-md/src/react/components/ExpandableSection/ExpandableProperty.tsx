import { PropertyContents } from "./components/PropertyContents.tsx";
import type { ExpandablePropertyProps } from "./types.ts";

/**
 * An expandable property renders a row in the UI that represents a property in
 * an object schema, aka a thing with a name, type, and annotations in the header
 * and front-matter, children, etc. in the body.
 */
export function ExpandableProperty(props: ExpandablePropertyProps) {
  return <PropertyContents {...props} />;
}
