"use client";

import "@speakeasy-api/docs-md-components";

import type { NonExpandableCellProps as NonExpandableCellElementProps } from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";

export type NonExpandableCellProps =
  PropsWithChildren<NonExpandableCellElementProps>;

/**
 * A non expandable cell is part of a schema row. It is responsible for
 * rendering the non-expandable button used in the tree-view of the schema. A
 * row is considered non-expandable if it a) has no child breakouts or
 * properties _and_ b) has no front matter. NonExpandableCell takes no props.
 *
 * Each row always has either one ExpandableCell or one NonExpandableCell, and
 * are always to the right of the connecting cells.
 */
export function NonExpandableCell(_: NonExpandableCellProps) {
  return <spk-non-expandable-cell />;
}
