import type { FC } from "react";

import type { ExpandableCellIconProps } from "../ExpandableCellIcon/type.ts";
import type { ConnectionType } from "../ExpandableSection/types.ts";

export type ExpandableCellProps = {
  /**
   * Whether the cell is currently open or not.
   */
  isOpen: boolean;
  /**
   * The connection state for the node to the node immediately below it. Due to
   * how the UI is laid out, this node only connects to the children (breakouts
   * or properties) of this node, if they exist.
   */
  bottomConnection: ConnectionType;
  /**
   * A callback to set the open state of the cell
   */
  setIsOpen: (isOpen: boolean) => void;
  /**
   * The variant of the cell
   */
  variant: "circle" | "square";
  /**
   * The component to use for rendering the expandable cell icon
   */
  ExpandableCellIcon?: FC<ExpandableCellIconProps>;
};
