import type { FC } from "react";

import type { ExpandableCellIconProps } from "../ExpandableCellIcon/type.ts";

export type ExpandableCellProps = {
  /**
   * Whether the cell is currently open or not.
   */
  isOpen: boolean;
  /**
   * A callback to set the open state of the cell
   */
  setIsOpen: (isOpen: boolean) => void;
  /**
   * The variant of the cell
   */
  variant: "breakout" | "property";
  /**
   * The component to use for rendering the expandable cell icon
   */
  ExpandableCellIcon?: FC<ExpandableCellIconProps>;
};
