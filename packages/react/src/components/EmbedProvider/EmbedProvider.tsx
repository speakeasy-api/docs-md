"use client";

import { useAtom } from "jotai";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { sidebarContentAtom } from "./state";
import styles from "./styles.module.css";

export const EmbedProvider = memo(function EmbedProvider() {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at once
  const [content, setContent] = useAtom(sidebarContentAtom);
  const [open, setOpen] = useState(false);

  const contentRef = useRef(content);
  if (contentRef.current !== content) {
    console.log(`Content changed to ${content?.title}`);
    contentRef.current = content;
  }
  console.log(contentRef.current?.title, open);

  const onAnimationComplete = useCallback(() => {
    if (!open) {
      setContent(null);
    }
  }, [open, setContent]);
  useEffect(() => {
    console.log(`Content changed to ${content?.title}`);
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
      <div>
        <h4>{content?.title ?? "Details"}</h4>
        <button onClick={closeRequest}>X</button>
      </div>
      {content && <div>{content.content}</div>}
    </div>
  );
});
