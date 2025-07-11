import type { SectionContentProps } from "./common/types.tsx";
import { NextraSectionContent } from "./nextra/SectionContent.tsx";

export function SectionContent(props: SectionContentProps) {
  return <NextraSectionContent {...props} />;
}
