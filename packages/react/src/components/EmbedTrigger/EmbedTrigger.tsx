"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports
import { sidebarContentAtom } from "../Embed/state";
import type { EmbedTriggerProps } from "./types";

export function EmbedTrigger({ children, slot }: EmbedTriggerProps) {
  const [, setContent] = useAtom(sidebarContentAtom);
  const onClick = useCallback(
    () => setContent({ title: "Embed", content: children }),
    [children, setContent]
  );
  return (
    <div slot={slot}>
      <button onClick={onClick}>{children}</button>
    </div>
  );
}
