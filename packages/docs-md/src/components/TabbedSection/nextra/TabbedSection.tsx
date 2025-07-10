"use client";

import { Container } from "../common/Container.tsx";
import type { TabbedSectionProps } from "../common/types.ts";
import { ChildrenContainer } from "./ChildrenContainer.tsx";
import { HeaderContainer } from "./HeaderContainer.tsx";
import { TabButton } from "./TabButton.tsx";

export function NextraTabbedSection({ children }: TabbedSectionProps) {
  return (
    <Container
      HeaderContainer={HeaderContainer}
      ChildrenContainer={ChildrenContainer}
      TabButton={TabButton}
    >
      {children}
    </Container>
  );
}
