import type { PropsWithChildren } from "react";

export type SectionTitleProps = PropsWithChildren<{
  /**
   * The DOM ID of the section title.
   */
  id?: string;
  /**
   * The slot of the section title, and will always be set to "title". This
   * property exists to allow our runtime hooks to find these slots.
   */
  slot: "title";
}>;
