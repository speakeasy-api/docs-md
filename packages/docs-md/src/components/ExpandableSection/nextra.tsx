import type { ExpandableSectionProps } from "./types.ts";

export function NextraExpandableSection({
  title,
  children,
}: ExpandableSectionProps) {
  return (
    <>
      <div>{title}</div>
      <div>{children}</div>
    </>
  );
}
