import type { EmbedProps } from "./types";

export function Embed({ children, slot }: EmbedProps) {
  return <div slot={slot}>{children}</div>;
}
