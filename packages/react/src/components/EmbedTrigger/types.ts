import type { PropsWithChildren } from "react";

export type EmbedTriggerProps = PropsWithChildren<{
  slot: "trigger";
  triggerText: string;
  embedTitle: string;
}>;
