import type { EmbedProps } from "./types.ts";

export function Embed({ children, slot }: EmbedProps) {
  return <div slot={slot}>{children}</div>;
}
