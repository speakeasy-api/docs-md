"use client";

import { useChildren } from "../../../util/hooks.ts";
import type { LayoutProps } from "../types.ts";
import styles from "./styles.module.css";

/**
 * This holds all of the elements of TryItNow and allows us to control the layout of the elements.
 * It can be replace by a custom layout if needed.
 *
 */
export function Layout({ children }: LayoutProps) {
  const editorChild = useChildren(children, "editor");
  const runButtonChild = useChildren(children, "runButton");
  const resultsChild = useChildren(children, "results");
  return (
    <>
      <div className={styles.layout}>
        {editorChild}
        <div className={styles.runButtonContainer}>{runButtonChild}</div>
      </div>
      {resultsChild}
    </>
  );
}
