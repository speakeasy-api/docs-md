import type { ExpandableEntryProps } from "./components/ExpandableEntryContents.tsx";
import { ExpandableEntryContents } from "./components/ExpandableEntryContents.tsx";

export function ExpandableEntry(props: ExpandableEntryProps) {
  return <ExpandableEntryContents {...props} />;
}
