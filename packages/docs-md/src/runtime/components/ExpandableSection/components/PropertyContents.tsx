"use client";

import type {
  DisplayTypeInfo,
  PropertyAnnotations,
} from "../../../../types/shared.ts";
import { useIsOpen } from "../state.ts";
import type { PrefixCellProps } from "./PrefixCells.tsx";
import { PrefixCells } from "./PrefixCells.tsx";
import { PropertyCell } from "./PropertyCell.tsx";

export type PropertyContentsProps = PrefixCellProps & {
  typeInfo?: DisplayTypeInfo;
  typeAnnotations: PropertyAnnotations[];
};

export function PropertyContents({
  id,
  slot,
  children,
  typeInfo,
  typeAnnotations,
}: PropertyContentsProps) {
  const [isOpen] = useIsOpen(id);
  return (
    <PrefixCells id={id} slot={slot} variant="circle">
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
