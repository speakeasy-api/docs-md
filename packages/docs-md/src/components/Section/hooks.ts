import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";

import { InternalError } from "../../util/internalError.ts";
import type { SectionContentProps } from "../SectionContent/common/types.tsx";
import type { SectionTitleProps } from "../SectionTitle/common/types.tsx";

function assertChildrenIsElementArray(
  children: ReactNode
): asserts children is ReactElement<Record<string, unknown>>[] {
  if (
    !Array.isArray(children) ||
    !children.every((child: unknown) => isValidElement(child)) ||
    !children.every(
      (child) => typeof child.props === "object" && child.props !== null
    )
  ) {
    throw new InternalError("Children must be an array of React Elements");
  }
}

export function useTitleChild(
  children: ReactNode,
  SectionTitle: FC<SectionTitleProps>
) {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    const titleChildren = children.filter(
      (child) => child.type === SectionTitle
    );

    if (titleChildren.length !== 1) {
      throw new InternalError(
        `Section must have exactly one title child, not ${titleChildren.length}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return titleChildren[0]!;
  }, [children, SectionTitle]);
}

export function useContentChildren(
  children: ReactNode,
  SectionContent: FC<SectionContentProps>
) {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    return children.filter((child) => child.type === SectionContent);
  }, [children, SectionContent]);
}
