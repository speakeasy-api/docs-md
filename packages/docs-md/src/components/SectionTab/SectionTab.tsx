import type { PropsWithChildren } from "react";

export type SectionTabProps = PropsWithChildren<{
  id: string;
  slot: "tab";
}>;

export function SectionTab({ children, id, slot }: SectionTabProps) {
  return (
    <div id={id} slot={slot}>
      {children}
    </div>
  );
}
