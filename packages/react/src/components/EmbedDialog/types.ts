import type { PropsWithChildren } from "react";

export type EmbedDialogProps = PropsWithChildren<{
  slot: "embeddialog";
  triggerText: string;
  embedTitle: string;
}>;
