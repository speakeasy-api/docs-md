import type { PropsWithChildren } from "react";

export type EmbedTriggerProps = PropsWithChildren<{
  /**
   * The slot for the trigger, always "trigger"
   */
  slot: "trigger";
  /**
   * The text to display on the trigger button, aka the Call To Action
   */
  triggerText: string;
  /**
   * The title of the embed, which is shown at the top of the dialog
   */
  embedTitle: string;
}>;
