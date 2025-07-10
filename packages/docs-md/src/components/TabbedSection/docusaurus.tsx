import { Card } from "../primitives/docusaurus/Card.tsx";
import { Container } from "./common/Container.tsx";
import type { TabbedSectionProps } from "./common/types.ts";
import { HeaderContainer } from "./docusaurus/HeaderContainer.tsx";
import { TabButton } from "./docusaurus/TabButton.tsx";

export function TabbedSection({ title, children }: TabbedSectionProps) {
  return (
    <Card>
      <Container
        HeaderContainer={HeaderContainer}
        TabButton={TabButton}
        title={title}
      >
        {children}
      </Container>
    </Card>
  );
}
