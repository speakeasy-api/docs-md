"use client";

import type { FC, PropsWithChildren } from "react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { InternalError } from "../../../../util/internalError.ts";
import { useChildren, useUniqueChild } from "../../../util/hooks.ts";
import type { SectionContentProps } from "../../SectionContent/types.ts";
import type { SectionTabProps } from "../../SectionTab/types.ts";
import type { SectionTitleProps } from "../../SectionTitle/types.ts";

export type TabButtonProps = PropsWithChildren<{
  isActive: boolean;
  onClick: () => void;
}>;

type ContainerProps = {
  TabButton: FC<TabButtonProps>;
  children: ReactNode;
};

export function useTabbedChildren({ TabButton, children }: ContainerProps) {
  const titleChild = useUniqueChild<SectionTitleProps>(children, "title");
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
