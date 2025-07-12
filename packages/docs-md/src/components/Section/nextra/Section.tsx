import { SectionContent } from "../../SectionContent/nextra.tsx";
import { SectionTitle } from "../../SectionTitle/nextra.tsx";
import type { SectionProps } from "../common/types.ts";
import { useContentChildren, useTitleChild } from "../hooks.ts";

export function NextraSection({ children }: SectionProps) {
  const titleChild = useTitleChild(children, SectionTitle);
  const contentChildren = useContentChildren(children, SectionContent);

  return (
    <>
      {titleChild}
      {contentChildren}
    </>
  );
}
