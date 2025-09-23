"use client";

// eslint-disable-next-line fast-import/no-restricted-imports
import { ExpandableTreeTopper as DefaultExpandableTreeTopper } from "../../ExpandableTreeTopper/ExpandableTreeTopper.tsx";
import type { ExpandableSectionProps } from "../types.ts";

export function ExpandableSectionContents({
  children,
  ExpandableTreeTopper = DefaultExpandableTreeTopper,
}: ExpandableSectionProps) {
  return (
    <>
      <ExpandableTreeTopper />
      {children}
    </>
  );
}
