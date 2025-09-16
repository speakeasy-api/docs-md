"use client";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ConnectingCell as DefaultConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ExpandableCell as DefaultExpandableCell } from "../../ExpandableCell/ExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { NonExpandableCell as DefaultNonExpandableCell } from "../../NonExpandableCell/NonExpandableCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { Pill as DefaultPill } from "../../Pill/Pill.tsx";
import { useIsOpen } from "../state.ts";
import type { ExpandablePropertyProps } from "../types.ts";
import { PrefixCells } from "./PrefixCells.tsx";
import { PropertyCell } from "./PropertyCell.tsx";

export function PropertyContents({
  id,
  slot,
  children,
  typeInfo,
  typeAnnotations,
  hasFrontMatter,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  ConnectingCell = DefaultConnectingCell,
  Pill = DefaultPill,
}: ExpandablePropertyProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells
      id={id}
      slot={slot}
      variant="circle"
      hasFrontMatter={hasFrontMatter}
      ExpandableCell={ExpandableCell}
      NonExpandableCell={NonExpandableCell}
      ConnectingCell={ConnectingCell}
    >
      <PropertyCell
        typeInfo={typeInfo}
        typeAnnotations={typeAnnotations}
        isOpen={isOpen}
        Pill={Pill}
      >
        {children}
      </PropertyCell>
    </PrefixCells>
  );
}
