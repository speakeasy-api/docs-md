"use client";

import { useMemo, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type {
  HeaderContainerProps,
  TabbedSectionProps,
  TabButtonProps,
} from "./types.ts";

type ContainerProps = {
  title: string;
  HeaderContainer: React.FC<HeaderContainerProps>;
  TabButton: React.FC<TabButtonProps>;
  children: TabbedSectionProps["children"];
};

export function Container({
  title,
  HeaderContainer,
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
  if (children.length === 0) {
    throw new InternalError("TabbedSection must have at least one child");
  }

  const tabInfo = useMemo(() => {
    return children.map(({ props: { title, tooltip } }) => {
      if (!title) {
        throw new InternalError("TabbedSection child title is missing");
      }
      return { title, tooltip };
    });
  }, [children]);

  // Guaranteed to always have at least one due to the check above
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [activeTitle, setActiveTitle] = useState(tabInfo[0]!.title);

  const activeChild = useMemo(() => {
    return children.find((child) => child.props.title === activeTitle);
  }, [children, activeTitle]);

  return (
    <>
      <HeaderContainer title={title}>
        {tabInfo.map(({ title, tooltip }) => (
          <TabButton
            key={title}
            title={title}
            tooltip={tooltip}
            isActive={title === activeTitle}
            onClick={() => setActiveTitle(title)}
          />
        ))}
      </HeaderContainer>
      <div>{activeChild}</div>
    </>
  );
}
