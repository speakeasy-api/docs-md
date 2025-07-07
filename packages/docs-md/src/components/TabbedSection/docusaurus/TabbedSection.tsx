import { useMemo, useState } from "react";

import { Card } from "../../primitives/docusaurus/Card.tsx";
import type { TabbedSectionProps } from "../common/types.ts";

export function DocusaurusTabbedSection({
  title,
  children,
}: TabbedSectionProps) {
  const titles = useMemo(() => {
    return children.map((child) => child.props.title);
  }, [children]);
  const [activeTitle] = useState(titles[0]);
  const activeChild = useMemo(() => {
    return children.find((child) => child.props.title === activeTitle);
  }, [children, activeTitle]);
  return (
    <Card>
      <div>
        {title}
        {titles.map((title) => (
          <div key={title}>{title}</div>
        ))}
      </div>
      <div>{activeChild}</div>
    </Card>
  );
}
