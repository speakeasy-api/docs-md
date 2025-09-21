import type { EmbedProps } from "../EmbedProvider/types";

export function Embed({ children, slot }: EmbedProps) {
  return <div slot={slot}>{children}</div>;
}
