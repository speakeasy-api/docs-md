import type { TabbedSectionProps } from "./common/types.ts";
import { NextraTabbedSection } from "./nextra/TabbedSection.tsx";

export function TabbedSection(props: TabbedSectionProps) {
  return <NextraTabbedSection {...props} />;
}
