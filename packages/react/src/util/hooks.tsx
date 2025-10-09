import type { FC, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Children, isValidElement, useMemo, useState } from "react";

import type { SectionContentProps } from "../components/SectionContent/types.ts";
import type { SectionTabProps } from "../components/SectionTab/types.ts";
import type { SectionTitleProps } from "../components/SectionTitle/types.ts";
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

type ContainerProps = {
  TabButton: FC<
    PropsWithChildren<{
      isActive: boolean;
      onClick: () => void;
    }>
  >;
  children: ReactNode;
};

export function useTabbedChildren({ TabButton, children }: ContainerProps) {
  // We don't always add a title, which is why we don't use useUniqueChild
  const titleChild = useChildren<SectionTitleProps>(children, "title");
  const contentChildren = useChildren<SectionContentProps>(children, "content");
  const tabChildren = useChildren<SectionTabProps>(children, "tab");

  if (!tabChildren.length) {
    throw new InternalError("TabbedSection must have at least one tab");
  }

  const firstTabId = tabChildren[0]?.props.id;
  if (!firstTabId) {
    throw new InternalError("Could not get id from first tab");
  }

  const [activeTabId, setActiveTabId] = useState(firstTabId);

  const activeChild = useMemo(() => {
    return contentChildren.find((child) => child.props.id === activeTabId);
  }, [contentChildren, activeTabId]);

  const tabChildrenWithButtons = useMemo(
    () =>
      tabChildren.map((tabChild) => {
        const id = tabChild.props.id;
        if (!id) {
          throw new InternalError("Could not get id from tab");
        }
        return (
          <TabButton
            key={id}
            isActive={id === activeTabId}
            onClick={() => setActiveTabId(id)}
          >
            {tabChild}
          </TabButton>
        );
      }),
    [TabButton, activeTabId, tabChildren]
  );

  return { titleChild, tabChildren: tabChildrenWithButtons, activeChild };
}
