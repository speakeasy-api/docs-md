import type { EmbedTriggerProps } from "./types";

export function EmbedTrigger({ children, slot }: EmbedTriggerProps) {
  return <div slot={slot}>{children}</div>;
}
