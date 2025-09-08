"use client";

import { useIsOpen } from "../state.ts";
import type { ExpandableBreakoutProps } from "../types.ts";
import { BreakoutCell } from "./BreakoutCell.tsx";
import { PrefixCells } from "./PrefixCells.tsx";

export function BreakoutContents({
  id,
  slot,
  hasFrontMatter,
  children,
}: ExpandableBreakoutProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells
      id={id}
      slot={slot}
      variant="square"
      hasFrontMatter={hasFrontMatter}
    >
      <BreakoutCell isOpen={isOpen}>{children}</BreakoutCell>
    </PrefixCells>
  );
}
