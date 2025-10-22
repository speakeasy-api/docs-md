"use client";

import { Children, isValidElement } from "react";

import { InternalError } from "../../../util/internalError.ts";
import { ConnectingCell } from "../../ConnectingCell/ConnectingCell.tsx";
import { ExpandableTreeTopper } from "../../ExpandableTreeTopper/ExpandableTreeTopper.tsx";
import type { ExpandableSectionProps } from "../types.ts";

export function ExpandableSectionContents({
  children,
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
