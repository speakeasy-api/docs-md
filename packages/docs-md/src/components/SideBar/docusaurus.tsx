"use client";

import { atom, useAtom } from "jotai";
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
  // animation trigger because it would otherwise clear all at once
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
        <div
          style={{
            backgroundColor: "var(--ifm-hero-background-color)",
            color: "var(--ifm-hero-text-color)",
            border:
              "var(--ifm-global-border-width) solid var(--ifm-blockquote-border-color)",
            borderRadius: "var(--ifm-global-radius)",
            boxShadow: "var(--ifm-global-shadow-tl)",
            padding:
              "var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                // Note: the docs at https://docusaurus.community/knowledge/design/css/variables/ say this variable
                // should be `--ifm-heading-h3-font-size`, but it doesn't exist. It's `--ifm-h3-font-size` instead.
                fontSize: "var(--ifm-h3-font-size)",
              }}
            >
              {content?.title}
            </div>
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
    </div>
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
      }}
    >
      {cta}
    </button>
  );
}
