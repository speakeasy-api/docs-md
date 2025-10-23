"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { CloseEmbedIcon } from "../CloseEmbedIcon/CloseEmbedIcon.tsx";
import { embedContentAtom } from "./state.ts";
import styles from "./styles.module.css";
import type { EmbedProviderProps } from "./types.ts";

export function EmbedProvider(_: EmbedProviderProps) {
  // We keep separate track of the open state vs content because we want to
  // start animating the closing of the sidebar before the content is cleared,
  // so that we see it slide off screen. This means we can't use content as an
  // animation trigger because it would otherwise clear all at once
  const [content, setContent] = useAtom(embedContentAtom);
  const [open, setOpen] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    if (!open) {
      setContent(null);
    }
  }, [open, setContent]);

  useEffect(() => {
    if (content) {
      setOpen(true);
    }
  }, [content]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content
          className={styles.dialogContent}
          onAnimationEnd={handleAnimationEnd}
        >
          <Dialog.Title className={styles.title}>{content?.title}</Dialog.Title>
          <div className={styles.embedContent}>{content?.content}</div>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className={styles.closeButton}
              onClick={handleClose}
            >
              <CloseEmbedIcon className={styles.closeIcon} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
