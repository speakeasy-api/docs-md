import type { PropertyContentsProps } from "./components/PropertyContents.tsx";
import { PropertyContents } from "./components/PropertyContents.tsx";

export function ExpandableProperty(props: PropertyContentsProps) {
  return <PropertyContents {...props} />;
}
