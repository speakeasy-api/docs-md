"use client";

import { Children, isValidElement } from "react";

import { InternalError } from "../../../util/internalError.ts";
// eslint-disable-next-line fast-import/no-restricted-imports
import { ConnectingCell as DefaultConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports
import { ExpandableTreeTopper as DefaultExpandableTreeTopper } from "../../ExpandableTreeTopper/ExpandableTreeTopper.tsx";
import type { ExpandableSectionProps } from "../types.ts";

export function ExpandableSectionContents({
  children,
  ExpandableTreeTopper = DefaultExpandableTreeTopper,
  ConnectingCell = DefaultConnectingCell,
}: ExpandableSectionProps) {
  return (
    <>
      <ExpandableTreeTopper />
      {Children.map(children, (child, index) => {
        // Filter out non-React elements to match ConnectingCell's type requirements
        if (!isValidElement(child)) {
          throw new InternalError("Expected a valid React element");
        }

        // `index` is stable for this data, since the children are determined by
        // the compiler and not at runtime
        return (
          <ConnectingCell
            key={index}
            bottom={
              index === Children.count(children) - 1 ? "none" : "connected"
            }
            top="connected"
            right="connected"
          >
            {child}
          </ConnectingCell>
        );
      })}
    </>
  );
}
