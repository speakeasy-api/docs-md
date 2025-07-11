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
  assertChildrenIsElementArray(children);

  // Get the title child
  const titleChildren = useMemo(
    () => children.filter((child) => child.type === SectionTitle),
    [children, SectionTitle]
  );
  if (titleChildren.length !== 1) {
    throw new InternalError(
      `Section must have exactly one title child, not ${titleChildren.length}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return titleChildren[0]!;
}

export function useContentChildren(
  children: ReactNode,
  SectionContent: FC<SectionContentProps>
) {
  assertChildrenIsElementArray(children);

  // Get the content children
  const contentChildren = useMemo(
    () => children.filter((child) => child.type === SectionContent),
    [children, SectionContent]
  );
  if (!contentChildren.length) {
    throw new InternalError("No section content children found");
  }

  return contentChildren;
}
