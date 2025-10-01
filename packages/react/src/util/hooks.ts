import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement, useMemo } from "react";

import { InternalError } from "./internalError.ts";

function normalizeChildren(
  children: ReactNode
): ReactElement<Record<string, unknown>>[] {
  const childrenArray = Children.toArray(children).filter((child) => {
    // TODO: for some reason we sometimes get invalid children while building in
    // Nextra. These invalid children seem to be transient though, and work fine
    // when the site is up an running. The internal representation does set the
    // "$$typeof" property to Symbol("react.lazy"), which is a hint.
    if (!isValidElement(child)) {
      return false;
    }
    if (typeof child.props !== "object") {
      return false;
    }
    return true;
  });

  return childrenArray as ReactElement<Record<string, unknown>>[];
}

export function useUniqueChild<ComponentProps>(
  children: ReactNode,
  slot: string
): ReactElement<ComponentProps> | undefined {
  return useMemo(() => {
    const normalizedChildren = normalizeChildren(children);

    const child = normalizedChildren.filter(
      (child) => child.props.slot === slot
    );

    if (child.length === 0 || child.length > 1) {
      throw new InternalError(
        `Section must have exactly one ${slot} child, not ${child.length}`
      );
    }

    return child[0] as ReactElement<ComponentProps>;
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
