import type { ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";

import { InternalError } from "../../../util/internalError.ts";

function normalizeChildren(
  children: ReactNode
): ReactElement<Record<string, unknown>>[] {
  if (children === null || children === undefined) {
    return [];
  }
  if (!Array.isArray(children) && typeof children === "object") {
    children = [children];
  }
  if (
    !Array.isArray(children) ||
    !children.every((child: unknown) => isValidElement(child)) ||
    !children.every(
      (child) => typeof child.props === "object" && child.props !== null
    )
  ) {
    throw new InternalError(
      "Children must be an array of React Elements, not " + typeof children
    );
  }

  return children as ReactElement<Record<string, unknown>>[];
}

export function useUniqueChild<ComponentProps>(
  children: ReactNode,
  slot: string
): ReactElement<ComponentProps> | undefined {
  return useMemo(() => {
    const normalizedChildren = normalizeChildren(children);

    const titleChildren = normalizedChildren.filter(
      (child) => child.props.slot === slot
    );

    if (titleChildren.length > 1) {
      throw new InternalError(
        `Section must have at most one title child, not ${titleChildren.length}`
      );
    }

    return titleChildren[0] as ReactElement<ComponentProps>;
  }, [children, slot]);
}

export function useChildren<ComponentProps>(
  children: ReactNode,
  slot: string
): ReactElement<ComponentProps>[] {
  return useMemo(() => {
    const normalizedChildren = normalizeChildren(children);

    return normalizedChildren.filter(
      (child) => child.props.slot === slot
    ) as ReactElement<ComponentProps>[];
  }, [children, slot]);
}
