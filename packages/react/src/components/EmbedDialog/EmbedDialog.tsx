"use client";
import { Dialog } from "radix-ui";

import type { EmbedDialogProps } from "./types.ts";
import styles from "./styles.module.css";

export function EmbedDialog({
  triggerText,
  embedTitle,
  children,
}: EmbedDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={styles.trigger}>{triggerText}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.title}>{embedTitle}</Dialog.Title>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button aria-label="Close" className={styles.closeButton}>
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
