import type { SectionEntryProps } from "./common/types.tsx";
import { NextraSectionEntry } from "./nextra/SectionEntry.tsx";

export function SectionEntry(props: SectionEntryProps) {
  return <NextraSectionEntry {...props} />;
}
