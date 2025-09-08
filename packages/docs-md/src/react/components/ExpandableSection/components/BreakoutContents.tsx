"use client";

// eslint-disable-next-line fast-import/no-restricted-imports
import { ConnectingCell as DefaultConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { ExpandableCell as DefaultExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { NonExpandableCell as DefaultNonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
import { useIsOpen } from "../state.ts";
import type { ExpandableBreakoutProps } from "../types.ts";
import { BreakoutCell } from "./BreakoutCell.tsx";
import { PrefixCells } from "./PrefixCells.tsx";

export function BreakoutContents({
  id,
  slot,
  hasFrontMatter,
  children,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  ConnectingCell = DefaultConnectingCell,
}: ExpandableBreakoutProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells
      id={id}
      slot={slot}
      variant="square"
      hasFrontMatter={hasFrontMatter}
      ExpandableCell={ExpandableCell}
      NonExpandableCell={NonExpandableCell}
      ConnectingCell={ConnectingCell}
    >
      <BreakoutCell isOpen={isOpen}>{children}</BreakoutCell>
    </PrefixCells>
  );
}
