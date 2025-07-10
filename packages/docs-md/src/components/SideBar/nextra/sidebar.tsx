"use client";

import React from "react";

import { Button } from "../../primitives/nextra/Button.tsx";
import { Card } from "../../primitives/nextra/Card.tsx";
import styles from "./styles.module.css";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};
export function NextraSideBar({
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
        <Button onClick={closeRequest} className={styles.close}>
          X
        </Button>
      </div>
      {content?.content}
    </Card>
  );
}
