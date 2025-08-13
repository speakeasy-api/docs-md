"use client";

import clsx from "clsx";
import React from "react";

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
    <>
      <div className={styles.sidebarContainer}>
        <h4 className={styles.sidebarTitle}>{content?.title ?? "Details"}</h4>
        <button
          onClick={closeRequest}
          // TODO: convert to using CSS tokens
          className={clsx(
            "x:focus-visible:nextra-focus x:cursor-pointer x:transition-colors x:border x:border-gray-200 x:hover:bg-gray-100 x:dark:hover:bg-neutral-800 x:select-none x:rounded x:flex x:items-center",
            styles.close
          )}
        >
          X
        </button>
      </div>
      {content?.content}
    </>
  );
}
