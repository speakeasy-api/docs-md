import type { EmbedProps } from "../EmbedProvider/types.ts";

export function Embed({ children, slot }: EmbedProps) {
  return <div slot={slot}>{children}</div>;
}
