import React from "react";

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
    <>
      <div className={styles.sidebarContainer}>
        <h4 className={styles.sidebarTitle}>{content?.title ?? "Details"}</h4>
        <button onClick={closeRequest}>X</button>
      </div>
      {content?.content}
    </>
  );
}
