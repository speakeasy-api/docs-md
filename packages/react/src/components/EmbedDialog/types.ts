import type { PropsWithChildren } from "react";

export type EmbedDialogProps = PropsWithChildren<{
  embedTitle: string;
  open: boolean;
  onClose: () => void;
  onAnimateCloseComplete: () => void;
}>;
