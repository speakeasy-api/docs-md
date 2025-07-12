import { SectionContent } from "../../SectionContent/nextra.tsx";
import { SectionTitle } from "../../SectionTitle/nextra.tsx";
import type { SectionProps } from "../common/types.ts";
import { useChildren, useUniqueChild } from "../hooks.ts";

export function NextraSection({ children }: SectionProps) {
  const titleChild = useUniqueChild(children, SectionTitle);
  const contentChildren = useChildren(children, SectionContent);

  return (
    <>
      {titleChild}
      {contentChildren}
    </>
  );
}
