"use client";

import { atom, useAtom } from "jotai";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import React, { useCallback, useEffect, useState } from "react";

import Container from "./container.mdx";

// TODO: https://github.com/orgs/mdx-js/discussions/2272 implies there's a more
// elegant way to do this, but I couldn't get it to work after a bit of fiddling
const TypedContainer = Container as React.FC<{ children: React.ReactNode }>;

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
        <TypedContainer>
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
        </TypedContainer>
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
  return <button onClick={onClick}>{cta}</button>;
}
