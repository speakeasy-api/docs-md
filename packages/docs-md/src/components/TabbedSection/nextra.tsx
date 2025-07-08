import type { TabbedSectionProps } from "./common/types.ts";
import { NextraTabbedSection } from "./nextra/TabbedSection.tsx";

export function TabbedSection(args: TabbedSectionProps) {
  return <NextraTabbedSection {...args} />;
}
