import clsx from "clsx";
import { useMemo, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import { Card } from "../../primitives/docusaurus/Card.tsx";
import type { TabbedSectionProps } from "../common/types.ts";
import styles from "./styles.module.css";

function TabButton({
  title,
  tooltip,
  isActive,
  onClick,
}: {
  title: string;
  tooltip?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={tooltip}
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
    <Card>
      <div className={styles.header}>
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
          {tabInfo.map(({ title, tooltip }) => (
            <TabButton
              key={title}
              title={title}
              tooltip={tooltip}
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
