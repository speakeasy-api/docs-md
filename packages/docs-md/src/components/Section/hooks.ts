import type { ReactElement, ReactNode } from "react";
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
  slot: string
): ReactElement<ComponentProps> {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    const titleChildren = children.filter((child) => child.props.slot === slot);

    if (titleChildren.length !== 1) {
      throw new InternalError(
        `Section must have exactly one title child, not ${titleChildren.length}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return titleChildren[0]! as ReactElement<ComponentProps>;
  }, [children, slot]);
}

export function useChildren<ComponentProps>(
  children: ReactNode,
  slot: string
): ReactElement<ComponentProps>[] {
  return useMemo(() => {
    assertChildrenIsElementArray(children);

    return children.filter(
      (child) => child.props.slot === slot
    ) as ReactElement<ComponentProps>[];
  }, [children, slot]);
}
