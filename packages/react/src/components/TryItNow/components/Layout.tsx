"use client";

import { useChildren } from "../../../util/hooks.ts";
import type { LayoutProps } from "../types.ts";
import { Controls } from "./Controls.tsx";
import styles from "./styles.module.css";

/**
 * This holds all of the elements of TryItNow and allows us to control the layout of the elements.
 * It can be replace by a custom layout if needed.
 *
 */
export function Layout({ children, status }: LayoutProps) {
  const editorChild = useChildren(children, "editor");
  const runButtonChild = useChildren(children, "runButton");
  const resultsChild = useChildren(children, "results");
  const resetButtonChild = useChildren(children, "resetButton");
  const copyButtonChild = useChildren(children, "copyButton");
  return (
    <div data-testid="try-it-now" className={styles.layout}>
      <div className={styles.editorContainer}>
        {editorChild}
        <Controls status={status}>
          {copyButtonChild}
          {resetButtonChild}
          {runButtonChild}
        </Controls>
      </div>
      {resultsChild}
    </div>
  );
}
