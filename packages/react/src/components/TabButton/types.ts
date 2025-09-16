import type { PropsWithChildren } from "react";

export type TabButtonProps = PropsWithChildren<{
  /**
   * Whether the tab is currently active.
   */
  isActive: boolean;
  /**
   * The callback to invoke when the tab is clicked.
   */
  onClick: () => void;
}>;
