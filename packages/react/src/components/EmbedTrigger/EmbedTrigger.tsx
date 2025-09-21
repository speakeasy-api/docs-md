"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports
import { embedContentAtom } from "../EmbedProvider/state.ts";
import styles from "../EmbedProvider/styles.module.css";
import type { EmbedTriggerProps } from "./types.ts";

export function EmbedTrigger({
  triggerText,
  embedTitle,
  slot,
  children,
}: EmbedTriggerProps) {
  const [, setContent] = useAtom(embedContentAtom);
  const onClick = useCallback(() => {
    setContent({ title: embedTitle, content: children });
  }, [children, setContent, embedTitle]);
  return (
    <div slot={slot}>
      <button className={styles.embedButton} onClick={onClick}>
        {triggerText}
      </button>
    </div>
  );
}
