import type { SectionTitleProps } from "./common/types.tsx";
import { NextraSectionTitle } from "./nextra/SectionTitle.tsx";

export function SectionTitle(props: SectionTitleProps) {
  return <NextraSectionTitle {...props} />;
}
