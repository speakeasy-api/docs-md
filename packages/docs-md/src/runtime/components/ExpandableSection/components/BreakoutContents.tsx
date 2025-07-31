"use client";

import { useIsOpen } from "../state.ts";
import { BreakoutCell } from "./BreakoutCell.tsx";
import type { PrefixCellProps } from "./PrefixCells.tsx";
import { PrefixCells } from "./PrefixCells.tsx";

export type BreakoutContentsProps = PrefixCellProps;

export function BreakoutContents({
  id,
  slot,
  children,
}: BreakoutContentsProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells id={id} slot={slot} variant="square">
      <BreakoutCell isOpen={isOpen}>{children}</BreakoutCell>
    </PrefixCells>
  );
}
