"use client";

import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { sidebarContentAtom } from "../state/atoms.ts";
import styles from "./styles.module.css";

export function SideBarContents() {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at once
  const [content, setContent] = useAtom(sidebarContentAtom);
  const [open, setOpen] = useState(false);

  const onAnimationComplete = useCallback(() => {
    if (!open) {
      setContent(null);
    }
  }, [open, setContent]);
  useEffect(() => {
    if (content) {
      setOpen(true);
    }
  }, [content]);

  const closeRequest = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "0",
        top: "10%",
        maxHeight: "85%",
        maxWidth: "50%",
        zIndex: 1000,
        overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease-in-out",
      }}
      onTransitionEnd={onAnimationComplete}
    >
      {content && (
        <>
          <div className={styles.sidebarContainer}>
            <h4 className={styles.sidebarTitle}>
              {content?.title ?? "Details"}
            </h4>
            <button onClick={closeRequest} className={clsx(styles.close)}>
              X
            </button>
          </div>
          {content?.content}
        </>
      )}
    </div>
  );
}
