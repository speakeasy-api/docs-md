import type { EmbedTriggerContentsProps } from "./types";

export function EmbedTriggerContents({ children }: EmbedTriggerContentsProps) {
  return <div slot="trigger-contents">{children}</div>;
}
