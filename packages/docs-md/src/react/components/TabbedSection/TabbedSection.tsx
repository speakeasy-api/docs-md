import { TabbedSectionContents } from "./components/TabbedSectionContents.tsx";
import type { TabbedSectionProps } from "./types.ts";

// TODO: this should probably be merged into the main Section component
/**
 * This component represents a tabbed section. A tabbed section is like an
 * extended version of a standard Section component. In addition to taking in
 * a single `title` slotted child and a set of `content` slotted children, it
 * also takes in a set of `tab` slotted children.
 *
 * There is always a one-to-one mapping between the `tab` and `content` slotted
 * children. Each tab and child are linked together via the `id` prop.
 */
export function TabbedSection(args: TabbedSectionProps) {
  return <TabbedSectionContents {...args} />;
}
