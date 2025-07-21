import { Button } from "../primitives/docusaurus/Button.tsx";
import { Section } from "../Section/docusaurus.tsx";
import { ExpandableSectionContents } from "./common/ExpandableSection.tsx";
import type { ExpandableSectionProps } from "./common/types.ts";

export function ExpandableSection(props: ExpandableSectionProps) {
  return (
    <ExpandableSectionContents Button={Button} Section={Section} {...props} />
  );
}
