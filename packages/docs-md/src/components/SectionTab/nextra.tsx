import type { SectionTabProps } from "./common/types.tsx";

export function SectionTab({ children, id }: SectionTabProps) {
  return <div id={id}>{children}</div>;
}
