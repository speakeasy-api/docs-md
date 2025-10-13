"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { EmbedDialog as DefaultEmbedDialog } from "../EmbedDialog/EmbedDialog.tsx";
import { embedContentAtom } from "./state.ts";
import type { EmbedProviderProps } from "./types.ts";

export function EmbedProvider({
  EmbedDialog = DefaultEmbedDialog,
}: EmbedProviderProps) {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at once
  const [content, setContent] = useAtom(embedContentAtom);
  const [open, setOpen] = useState(false);

  const handleAnimateCloseComplete = useCallback(() => {
    setContent(null);
  }, [setContent]);

  useEffect(() => {
    if (content) {
      setOpen(true);
    }
  }, [content]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <EmbedDialog
      embedTitle={content?.title ?? "Details"}
      open={open}
      onClose={handleClose}
      onAnimateCloseComplete={handleAnimateCloseComplete}
    >
      {content?.content}
    </EmbedDialog>
  );
}
