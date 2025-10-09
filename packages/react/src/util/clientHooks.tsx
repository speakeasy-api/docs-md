"use client";

import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import type { ResponseTabProps } from "../components/ResponseTabbedSection/types.ts";
import type { SectionContentProps } from "../components/SectionContent/types.ts";
import type { SectionTitleProps } from "../components/SectionTitle/types.ts";
import { useChildren } from "./hooks.ts";
import { InternalError } from "./internalError.ts";

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
  const tabChildren = useChildren<ResponseTabProps>(children, "tab");

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
