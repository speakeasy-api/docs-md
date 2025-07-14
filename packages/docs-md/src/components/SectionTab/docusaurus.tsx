import type { SectionTabProps } from "./common/types.tsx";

export function SectionTab({ children, id, slot }: SectionTabProps) {
  return (
    <div id={id} slot={slot}>
      {children}
    </div>
  );
}
