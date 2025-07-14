import type { SectionProps } from "../common/types.ts";
import { useChildren, useUniqueChild } from "../hooks.ts";

export function NextraSection({ children }: SectionProps) {
  const titleChild = useUniqueChild(children, "title");
  const contentChildren = useChildren(children, "content");

  return (
    <>
      {titleChild}
      {contentChildren}
    </>
  );
}
