"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { embedContentAtom } from "./state.ts";
import styles from "./styles.module.css";

export function EmbedProvider() {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at once
  const [content, setContent] = useAtom(embedContentAtom);
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
      className={styles.embedContainer}
      style={{
        transform: open ? "translateX(0)" : "translateX(100%)",
      }}
      onTransitionEnd={onAnimationComplete}
    >
      <div className={styles.embedHeader}>
        <h2>{content?.title ?? "Details"}</h2>
        <button className={styles.embedButton} onClick={closeRequest}>
          &gt;
        </button>
      </div>
      {content && <div>{content.content}</div>}
    </div>
  );
}
