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
};
