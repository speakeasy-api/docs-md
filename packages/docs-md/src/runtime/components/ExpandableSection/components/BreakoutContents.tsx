"use client";

import { useIsOpen } from "../state.ts";
import type { RowProps } from "../types.ts";
import { BreakoutCell } from "./BreakoutCell.tsx";
import { PrefixCells } from "./PrefixCells.tsx";

export type BreakoutContentsProps = RowProps;

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
