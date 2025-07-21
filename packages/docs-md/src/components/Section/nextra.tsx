import { SectionContents } from "./common/Section.tsx";
import type { SectionProps } from "./common/types.ts";

export function Section(props: SectionProps) {
  return <SectionContents {...props} />;
}
