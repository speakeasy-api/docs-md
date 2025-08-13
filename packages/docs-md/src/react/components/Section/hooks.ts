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
  if (!Array.isArray(children)) {
    throw new InternalError("Children must be an array");
  }

  // TODO: for some reason we sometimes get invalid children while building in
  // Nextra. These invalid children seem to be transient though, and work fine
  // when the site is up an running. The internal representation does set the
  // "$$typeof" property to Symbol("react.lazy"), which is a hint.
  children = children.filter((child) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!isValidElement(child)) {
      return false;
    }
    if (typeof child.props !== "object") {
      return false;
    }
    return true;
  });

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
