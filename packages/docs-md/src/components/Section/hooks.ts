import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";

import { InternalError } from "../../util/internalError.ts";

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

export function useUniqueChild<ComponentProps>(
  children: ReactNode,
  Component: FC<ComponentProps>
): ReactElement<ComponentProps> {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    const titleChildren = children.filter((child) => child.type === Component);

    if (titleChildren.length !== 1) {
      throw new InternalError(
        `Section must have exactly one title child, not ${titleChildren.length}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return titleChildren[0]! as ReactElement<ComponentProps>;
  }, [children, Component]);
}

export function useChildren<ComponentProps>(
  children: ReactNode,
  Component: FC<ComponentProps>
): ReactElement<ComponentProps>[] {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    return children.filter(
      (child) => child.type === Component
    ) as ReactElement<ComponentProps>[];
  }, [children, Component]);
}
