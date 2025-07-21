"use client";

import { Button } from "../../primitives/nextra/Button.tsx";
import { Section } from "../../Section/nextra.tsx";
import { ExpandableSectionContents } from "../common/ExpandableSection.tsx";
import type { ExpandableSectionProps } from "../common/types.ts";

export function ExpandableSectionWrapper(props: ExpandableSectionProps) {
  return (
    <ExpandableSectionContents Button={Button} Section={Section} {...props} />
  );
}
