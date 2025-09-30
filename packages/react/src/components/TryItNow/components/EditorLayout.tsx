import { useChildren } from "../../../util/hooks";
import styles from "./styles.module.css";

export const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const editorChild = useChildren(children, "editor");
  const runButtonChild = useChildren(children, "runButton");

  return (
    <div className={styles.editorContainer}>
      {editorChild}
      <div className={styles.runButtonContainer}>{runButtonChild}</div>
    </div>
  );
};
