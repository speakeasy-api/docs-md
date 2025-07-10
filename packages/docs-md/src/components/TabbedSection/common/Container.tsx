"use client";

import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type {
  ContentProps,
  HeaderContainerProps,
  TabbedSectionProps,
  TabButtonProps,
  TabProps,
  TitleProps,
} from "./types.ts";

type ContainerProps = {
  HeaderContainer: React.FC<HeaderContainerProps>;
  ChildrenContainer: React.FC<PropsWithChildren>;
  TabButton: React.FC<TabButtonProps>;
  children: TabbedSectionProps["children"];
};

export function Container({
  HeaderContainer,
  ChildrenContainer,
  TabButton,
  children,
}: ContainerProps) {
  // If there is only one child, then React collapsed children down into a
  // single object instead of an array
  if (!Array.isArray(children)) {
    if (typeof children === "object") {
      children = [children];
    } else {
      throw new InternalError("TabbedSection children must be an array");
    }
  }

  // Get the title child
  const titleChildren = useMemo(
    () =>
      children.filter(
        ({ props: { slot } }) => slot === "title"
        // TypeScript doesn't narrow on filter, so we have to cast explicitly
      ) as React.ReactElement<TitleProps>[],
    [children]
  );
  if (titleChildren.length !== 1) {
    throw new InternalError("TabbedSection must have exactly one title child");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleChild = titleChildren[0]!;

  // Get the tab children
  const tabChildren = useMemo(
    () =>
      children.filter(
        ({ props: { slot } }) => slot === "tab"
        // TypeScript doesn't narrow on filter, so we have to cast explicitly
      ) as React.ReactElement<TabProps>[],
    [children]
  );
  if (tabChildren.length === 0) {
    throw new InternalError("TabbedSection must have at least one tab child");
  }

  // Get the content children
  const contentChildren = useMemo(
    () =>
      children.filter(
        ({ props: { slot } }) => slot === "content"
        // TypeScript doesn't narrow on filter, so we have to cast explicitly
      ) as React.ReactElement<ContentProps>[],
    [children]
  );
  if (contentChildren.length === 0) {
    throw new InternalError(
      "TabbedSection must have at least one content child"
    );
  }

  const [activeTabId, setActiveTabId] = useState(
    // Guaranteed to always have at least one due to the checks above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tabChildren[0]!.props["data-tab-id"]
  );

  const activeChild = useMemo(() => {
    return contentChildren.find(
      (child) => child.props["data-tab-content-id"] === activeTabId
    );
  }, [contentChildren, activeTabId]);

  const tabChildrenWithButtons = useMemo(
    () =>
      tabChildren.map((tabChild) => {
        const id = tabChild.props["data-tab-id"];
        console.log(id, activeTabId);
        return (
          <TabButton
            key={id}
            title={tabChild.props.title}
            isActive={id === activeTabId}
            onClick={() => setActiveTabId(id)}
          >
            {tabChild}
          </TabButton>
        );
      }),
    [TabButton, activeTabId, tabChildren]
  );

  return (
    <>
      {/* Since children needs to be very specifically ordered, we have to
          pass it in as a prop to make TypeScript happy */}
      {/* eslint-disable-next-line react/no-children-prop */}
      <HeaderContainer children={[titleChild, ...tabChildrenWithButtons]} />
      <ChildrenContainer>{activeChild}</ChildrenContainer>
    </>
  );
}
