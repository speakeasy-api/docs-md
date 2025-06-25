"use client";

import { atom, useAtom } from "jotai";
import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useState } from "react";

import type { SidebarContent } from "./types.ts";

const sidebarContentAtom = atom<SidebarContent | null>(null);

export function SideBarContents({
  SideBarContainer,
}: {
  SideBarContainer: FC<{
    content: SidebarContent;
    closeRequest: () => void;
  }>;
}) {
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
        <SideBarContainer content={content} closeRequest={closeRequest} />
      )}
    </div>
  );
}

export type SideBarTriggerProps = PropsWithChildren<{
  cta: string;
  title: string;
}>;

export function SideBarTriggerContents({
  cta,
  children,
  title,
  Button,
}: SideBarTriggerProps & {
  Button: FC<PropsWithChildren<{ onClick: () => void }>>;
}) {
  const [, setContent] = useAtom(sidebarContentAtom);
  const onClick = useCallback(
    () => setContent({ title, content: children }),
    [title, children]
  );
  return <Button onClick={onClick}>{cta}</Button>;
}
