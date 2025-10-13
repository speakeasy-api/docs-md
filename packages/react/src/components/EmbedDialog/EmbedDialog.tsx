"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback } from "react";

import styles from "./styles.module.css";
import type { EmbedDialogProps } from "./types.ts";

export function EmbedDialog({
  embedTitle,
  children,
  open,
  onClose,
  onAnimateCloseComplete,
}: EmbedDialogProps) {
  const handleAnimationEnd = useCallback(() => {
    if (!open) {
      onAnimateCloseComplete();
    }
  }, [open, onAnimateCloseComplete]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content
          className={styles.dialogContent}
          onAnimationEnd={handleAnimationEnd}
        >
          <Dialog.Title className={styles.title}>{embedTitle}</Dialog.Title>
          <div className={styles.embedContent}>{children}</div>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className={styles.closeButton}
              onClick={onClose}
            >
              <svg
                className={styles.closeIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
