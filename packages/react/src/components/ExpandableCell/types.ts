import type { FC } from "react";

import type { ExpandableCellIconProps } from "../ExpandableCellIcon/type.ts";
import type { ConnectionType } from "../ExpandableSection/types.ts";

export type ExpandableCellProps = {
  isOpen: boolean;
  bottomConnection: ConnectionType;
  setIsOpen: (isOpen: boolean) => void;
  variant: "circle" | "square";
  ExpandableCellIcon?: FC<ExpandableCellIconProps>;
};
