"use client";

import { atom, useAtom } from "jotai";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import React, { useCallback, useEffect, useState } from "react";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

const sidebarContentAtom = atom<SidebarContent | null>(null);

export function SideBar() {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at
  const [content, setContent] = useAtom(sidebarContentAtom);
  const [open, setOpen] = useState(false);

  const onAnimationComplete = useCallback(() => {
    if (!open) {
      setContent(null);
    }
  }, [open]);
  useEffect(() => {
    if (content) {
      setOpen(true);
    }
  }, [content]);

  // TODO: also need to listen for keyboard events
  const clickShield = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);
  const closeRequest = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        right: "-100%",
        top: "10%",
        maxHeight: "85%",
        maxWidth: "50%",
        zIndex: 1000,
        overflowY: "scroll",
      }}
      animate={{
        right: open ? "0" : "-100%",
        transition: {
          duration: 0.3,
        },
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {content && (
        <details
          open
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <summary
            style={{
              cursor: "default",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={clickShield}
          >
            {content?.title}
            <button onClick={closeRequest}>X</button>
          </summary>
          {content?.content}
        </details>
      )}
    </motion.div>
  );
}

export function SideBarCta({
  cta,
  children,
  title,
}: PropsWithChildren<{
  cta: string;
  title: string;
}>) {
  const [, setContent] = useAtom(sidebarContentAtom);
  const onClick = useCallback(
    () => setContent({ title, content: children }),
    [title, children]
  );
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {cta}
    </button>
  );
}
