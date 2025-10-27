"use client";

import type { ExpandableBreakoutProps } from "../types.ts";

export function BreakoutContents(props: ExpandableBreakoutProps) {
  return (
    <spk-breakout
      {...props}
      entryId={props.id}
      id={props.headingId}
    ></spk-breakout>
  );
}
