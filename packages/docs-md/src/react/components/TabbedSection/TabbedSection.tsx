import type { TabbedSectionProps } from "./TabbedSectionContents.tsx";
import { TabbedSectionContents } from "./TabbedSectionContents.tsx";

export function TabbedSection(args: TabbedSectionProps) {
  return <TabbedSectionContents {...args} />;
}
