"use client";

// eslint-disable-next-line fast-import/no-restricted-imports
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
  Pill = DefaultPill,
}: ExpandablePropertyProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells
      id={id}
      slot={slot}
      variant="circle"
      hasFrontMatter={hasFrontMatter}
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
