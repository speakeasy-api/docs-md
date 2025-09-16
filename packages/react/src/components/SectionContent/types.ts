import type { PropsWithChildren } from "react";

export type SectionContentProps = PropsWithChildren<{
  /**
   * The DOM ID of the section content.
   */
  id?: string;
  /**
   * The slot of the section content, and will always be set to "content". This
   * property exists to allow our runtime hooks to find these slots.
   */
  slot: "content";
}>;
