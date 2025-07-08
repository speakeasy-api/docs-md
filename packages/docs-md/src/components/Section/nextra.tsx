import type { SectionProps } from "./common/types.ts";
import { NextraSection } from "./nextra/Section.tsx";

export function Section(props: SectionProps) {
  return <NextraSection {...props} />;
}
