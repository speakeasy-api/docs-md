import type { PropsWithChildren } from "react";

export type SectionTabProps = PropsWithChildren<{
  /**
   * The ID of the section tab.
   */
  id: string;
  /**
   * The slot of the section tab, and will always be set to "tab". This property
   * exists to allow our runtime hooks to find these slots.
   */
  slot: "tab";
}>;
