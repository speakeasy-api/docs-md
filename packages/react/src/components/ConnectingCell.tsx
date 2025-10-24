import type { ConnectingCellProps as ConnectingCellElementProps } from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";
import { Children } from "react";

export type ConnectingCellProps = PropsWithChildren<ConnectingCellElementProps>;

/**
 * A connecting cell is used to display connecting lines in the tree-view of the
 * schema. This cell does two things:
 * 1. It creates padding to indent the content from the expand button
 * 2. It draws connecting lines from the parent to its children, if they exist
 *
 * If you do not wish to draw a visual indicator for connecting cells, then
 * you'll still need to override it, but you can either just have it return a
 * `div` with a fixed width, or you can have it return `null` and set a margin
 * on the content/padding on the parent to create the same effect.
 */
export function ConnectingCell({ children, ...props }: ConnectingCellProps) {
  const hasChildren = Children.count(children) > 0;
  return (
    <spk-connecting-cell {...props}>
      {/* We get children that are assigned to parent slots with all sorts of
          names, so we wrap them in a div to force the default name */}
      {hasChildren ? <div>{children}</div> : null}
    </spk-connecting-cell>
  );
}
