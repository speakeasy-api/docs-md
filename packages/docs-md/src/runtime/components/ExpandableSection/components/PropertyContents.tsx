"use client";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "../../../../types/shared.ts";
import { useIsOpen } from "../state.ts";
import type { RowProps } from "../types.ts";
import { PrefixCells } from "./PrefixCells.tsx";
import { PropertyCell } from "./PropertyCell.tsx";

export type PropertyContentsProps = RowProps & {
  typeInfo?: DisplayTypeInfo;
  typeAnnotations: PropertyAnnotations[];
};

export function PropertyContents({
  id,
  slot,
  children,
  typeInfo,
  typeAnnotations,
  hasFrontMatter,
}: PropertyContentsProps) {
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
      >
        {children}
      </PropertyCell>
    </PrefixCells>
  );
}
