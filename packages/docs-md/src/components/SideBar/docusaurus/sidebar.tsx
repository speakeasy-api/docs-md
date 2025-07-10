import React from "react";

import { Button } from "../../primitives/docusaurus/Button.tsx";
import { Card } from "../../primitives/docusaurus/Card.tsx";
import styles from "./styles.module.css";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

export function DocusaurusSideBar({
  content,
  closeRequest,
}: {
  content: SidebarContent;
  closeRequest: () => void;
}) {
  return (
    <Card>
      <div className={styles.sidebarContainer}>
        <h4 className={styles.sidebarTitle}>{content?.title ?? "Details"}</h4>
        <Button onClick={closeRequest}>X</Button>
      </div>
      {content?.content}
    </Card>
  );
}
