"use client";

import { Card } from "../../primitives/nextra/Card.tsx";
import { Container } from "../common/Container.tsx";
import type { TabbedSectionProps } from "../common/types.ts";
import { ChildrenContainer } from "./ChildrenContainer.tsx";
import { HeaderContainer } from "./HeaderContainer.tsx";
import { TabButton } from "./TabButton.tsx";

export function NextraTabbedSection({ title, children }: TabbedSectionProps) {
  return (
    <Card>
      <Container
        HeaderContainer={HeaderContainer}
        ChildrenContainer={ChildrenContainer}
        TabButton={TabButton}
        title={title}
      >
        {children}
      </Container>
    </Card>
  );
}
