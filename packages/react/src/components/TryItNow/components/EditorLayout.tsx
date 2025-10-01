import { useChildren } from "../../../util/hooks.ts";
import styles from "./styles.module.css";

export function EditorLayout({ children }: { children: React.ReactNode }) {
  const editorChild = useChildren(children, "editor");
  const runButtonChild = useChildren(children, "runButton");

  return (
    <div className={styles.editorContainer}>
      {editorChild}
      <div className={styles.runButtonContainer}>{runButtonChild}</div>
    </div>
  );
}
