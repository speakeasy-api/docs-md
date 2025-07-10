import { Container } from "./common/Container.tsx";
import type { TabbedSectionProps } from "./common/types.ts";
import { ChildrenContainer } from "./docusaurus/ChildrenContainer.tsx";
import { HeaderContainer } from "./docusaurus/HeaderContainer.tsx";
import { TabButton } from "./docusaurus/TabButton.tsx";

export function TabbedSection({ children }: TabbedSectionProps) {
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
