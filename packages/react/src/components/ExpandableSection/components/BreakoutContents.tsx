"use client";

import type { ExpandableBreakoutProps } from "../types.ts";

export function BreakoutContents(props: ExpandableBreakoutProps) {
  return (
    <spk-expandable-breakout
      {...props}
      entryId={props.id}
      id={props.headingId}
    ></spk-expandable-breakout>
  );
}
