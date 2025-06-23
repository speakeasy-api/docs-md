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

export function DocusaurusSideBar() {
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
        <div
          style={{
            backgroundColor: "var(--ifm-alert-background-color)",
            border: "1px solid var(--ifm-alert-border-color)",
            borderRadius: "var(--ifm-alert-border-radius)",
            boxShadow: "var(--ifm-alert-shadow)",
            color: "var(--ifm-alert-foreground-color)",
            padding:
              "var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal)",
          }}
        >
          <div>
            <h2>{content?.title}</h2>
            <button onClick={closeRequest}>X</button>
          </div>
          <hr
            style={{
              height: "1px",
              backgroundColor: "var(--ifm-breadcrumb-color-active)",
            }}
          />
          {content?.content}
        </div>
      )}
    </motion.div>
  );
}

export function DocusaurusSideBarCta({
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
