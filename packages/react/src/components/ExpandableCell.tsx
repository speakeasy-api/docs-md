"use client";

import type { ExpandableCellProps as ExpandableCellElementProps } from "@speakeasy-api/docs-md-components";
import { type PropsWithChildren } from "react";

import { useEventListeners } from "../util/events.ts";

export type ExpandableCellProps = PropsWithChildren<
  ExpandableCellElementProps & {
    setIsOpen: (isOpen: boolean) => void;
  }
>;

/**
 * An Expandable cell is part of a schema row. It is responsible for rendering
 * the expandable button used in the tree-view of the schema. Each row always
 * has either one ExpandableCell or one NonExpandableCell, and are always to the
 * right of the connecting cells.
 *
 * We use an expandable cell any time a breakout/property has children (other
 * breakouts/properties) and/or has front matter (description, examples,
 * default value, etc.)
 *
 * Note: this is a controlled component. The initial open/closed state is set by
 * the compiled MDX code, and its state is managed by
 * src/components/ExpandableSection/components/PrefixCells.tsx
 */
export function ExpandableCell({ setIsOpen, ...props }: ExpandableCellProps) {
  const ref = useEventListeners({
    "spk-toggle": () => setIsOpen(false),
  });
  return <spk-expandable-cell ref={ref} {...props} />;
}
