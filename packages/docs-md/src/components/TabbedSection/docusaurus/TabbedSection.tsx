import clsx from "clsx";
import { useMemo, useState } from "react";

import { Card } from "../../primitives/docusaurus/Card.tsx";
import type { TabbedSectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

function TabButton({
  title,
  isActive,
  onClick,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive
      )}
      style={{
        fontWeight: isActive ? "bold" : "normal",
      }}
    >
      {title}
    </button>
  );
}

export function DocusaurusTabbedSection({
  title,
  children,
  baseHeadingLevel,
}: TabbedSectionProps) {
  const titles = useMemo(() => {
    return children.map((child) => child.props.title);
  }, [children]);
  const [activeTitle, setActiveTitle] = useState(titles[0]);
  const activeChild = useMemo(() => {
    return children.find((child) => child.props.title === activeTitle);
  }, [children, activeTitle]);
  return (
    <Card>
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 1,
            fontWeight: "bold",
            // Note: the docs at https://docusaurus.community/knowledge/design/css/variables/ say this variable
            // should be `--ifm-heading-h3-font-size`, but it doesn't exist. It's `--ifm-h3-font-size` instead.
            fontSize: `var(--ifm-h${baseHeadingLevel}-font-size)`,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {titles.map((title) => (
            <TabButton
              key={title}
              title={title}
              isActive={title === activeTitle}
              onClick={() => setActiveTitle(title)}
            />
          ))}
        </div>
      </div>
      <div>{activeChild}</div>
    </Card>
  );
}
